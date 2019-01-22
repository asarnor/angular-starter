import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Title } from '@angular/platform-browser';
import { map, filter, mergeMap } from 'rxjs/operators';

import { environment } from '$env';
import { AuthService, ServiceWorkerService, AppCommsService, AppSettings } from '$shared';
import { VersionManagementService } from './shared/services/version-management.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  /** Global/app errors */
  public error$ = this.settings.error$;
  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private title: Title,
    private authService: AuthService,
    private sw: ServiceWorkerService,
    private comms: AppCommsService,
    private version: VersionManagementService,
    private settings: AppSettings,
  ) {}

  ngOnInit() {
    this.routeChange();

    // If service worker
    if (environment.settings.enableServiceWorker) {
      this.sw.enable();
    }

    // If app comms
    if (environment.settings.enableAppComms) {
      this.comms.commsEnable();
    }

    // If version endpoint specified, poll for version changes
    if (environment.endpoints.version) {
      this.version.versionCheckStart();
    }
  }

  /**
   * Actions to perform on route change
   * Page titles are in app.routes.ts
   */
  public routeChange() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map(route => {
          while (route.firstChild) {
            route = route.firstChild;
          }
          return route;
        }),
        filter(route => route.outlet === 'primary'),
        mergeMap(route => route.data),
      )
      .subscribe(event => {
        this.title.setTitle(event['title'] + ' | ' + environment.properties.appName); // Change document title
        // If auth endpoint is available and not on the login page
        if (environment.settings.enableAuth && this.router.url.toLowerCase().indexOf('login') === -1) {
          this.authService.refreshTokenUpdate(); // On Route change, refresh authentication token
        }
      });
  } // end routeChange
}
