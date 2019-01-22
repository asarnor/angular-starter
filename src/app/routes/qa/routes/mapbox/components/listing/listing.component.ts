import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-listing',
  templateUrl: './listing.component.html',
  styleUrls: ['./listing.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ListingComponent implements OnInit {
  @Input() listing: Models.LocationMLS;
  @Output() listingSelected = new EventEmitter<Models.LocationMLS>();

  constructor() {}

  ngOnInit() {}
}
