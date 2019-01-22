import { Component, OnInit, ChangeDetectionStrategy, Input, OnChanges, EventEmitter, Output } from '@angular/core';
import { PageEvent } from '@angular/material';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-listings',
  templateUrl: './listings.component.html',
  styleUrls: ['./listings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListingsComponent implements OnInit, OnChanges {
  @Input() locations: Models.LocationMLS[];
  @Output() listingSelected = new EventEmitter<Models.LocationMLS>();

  public locations$ = new BehaviorSubject<Models.LocationMLS[]>(null);
  public pageIndex = 0;
  public pageSize = 10;

  constructor() {}

  ngOnInit() {}

  ngOnChanges() {
    // If locations already exist and new ones are passed down, reset page index to zero
    if (this.locations) {
      this.pageIndex = 0;
    }
    // Run through paginator params
    this.locations$.next(this.locationsFilter(this.locations, this.pageIndex, this.pageSize));
  }

  /**
   * When the paginator changes the visible page
   * @param page
   */
  public pageChanged(page: PageEvent) {
    this.pageIndex = page.pageIndex;
    this.pageSize = page.pageSize;
    // Run through paginator params
    this.locations$.next(this.locationsFilter(this.locations, this.pageIndex, this.pageSize));
  }

  public modalLaunch() {}

  /**
   * Filter the locations based on the paginator information
   * @param locations
   * @param pageIndex
   * @param pageSize
   */
  private locationsFilter(locations: Models.LocationMLS[], pageIndex: number, pageSize: number) {
    // Make sure locations not null
    if (!locations) {
      return;
    }
    // Get start and end index
    const start = pageIndex * pageSize;
    const end = (pageIndex + 1) * pageSize - 1;
    return locations.filter((_location, i) => {
      if (i >= start && i <= end) {
        return true;
      }
      return false;
    });
  }
}
