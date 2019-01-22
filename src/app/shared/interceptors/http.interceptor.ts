import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { AppSettings } from '../app.settings';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ApiService } from '$api';

@Injectable()
export class HttpInterceptorService implements HttpInterceptor {
  /**
   * Append bearer token to auth settings
   * @param settings
   */
  constructor(private settings: AppSettings, private router: Router, private api: ApiService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Add any custom headers
    const headersObj: { [keys: string]: string } = {};
    // If token present, add bearer token
    if (this.settings.token) {
      headersObj['Authorization'] = 'Bearer ' + this.settings.token;
    }
    // Create headers element
    const headers = new HttpHeaders(headersObj);
    // Clone request, add headers
    const cloneReq = next.handle(req.clone({ headers }));
    // Return request, handle errors globally here
    return cloneReq.pipe(catchError(error => {
      // If forbidden error, end session
      if (error.status === 401 || error.status === 403) {
        this.sessionEnd();
      }
      // Catch and rethrow error
      return throwError(error);
    }) as any);
  }

  /**
   * End the user's session based on auth failure
   */
  private sessionEnd() {
    this.settings.token = null; // Clear token
    this.api.resetStore(); // Reset api store and api cache
    this.router.navigate(['/login'], { queryParams: { session: 'expired' } }); // Bounce to login page
  }
}
