import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

declare interface LocationMLS {
  city: string;
  county: string;
  days_on_market: number;
  display_address: string;
  display_lat: number;
  display_lng: number;
  hoa_fee: string;
  is_condo: string;
  is_condo_townhouse: string;
  is_lot: string;
  is_multi_family: string;
  is_single_family: string;
  is_townhouse: string;
  listing_price: string;
  listing_status: string;
  listing_status_standardized: string;
  lot_dimension: string;
  photo_url: string;
  photos: string;
  property_id: number;
  square_feet: string;
  thumbnail_url: string;
  total_bathrooms: string;
  total_bedrooms: string;
  year_built: string;
  zip_code: number;
}

@Component({
  selector: 'app-mapbox',
  templateUrl: './mapbox.component.html',
  styleUrls: ['./mapbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapboxComponent implements OnInit {
  public heatMap = true;
  public locations: any[];

  public sidebarMobileShow = false;

  public formSearch: FormGroup;

  constructor(private fb: FormBuilder, private http: HttpClient, private ref: ChangeDetectorRef) {}

  ngOnInit() {
    // Create searchable locations
    this.formSearch = this.fb.group({
      zip: ['', []],
      priceLow: ['', []],
      priceHigh: ['', []],
      bedroomsMin: ['', []],
      bedroomsMax: ['', []],
      homeTypes: ['', []],
      sqFootageMin: ['', []],
      sqFootageMax: ['', []],
      is_single_family: [false, []],
      is_multi_family: [false, []],
      is_townhouse: [false, []],
      is_condo: [false, []],
    });

    this.http.get<LocationMLS[]>('assets/mock-data/properties.json').subscribe(locations => {
      this.locations = locations.map(location => {
        return {
          ...location,
          metadata: {
            title: location.display_address,
            description: location.city + ', ' + location.county + ' ' + location.zip_code,
          },
          latitude: location.display_lat,
          longitude: location.display_lng,
        };
      });
      this.locations.length = 500;
      this.ref.markForCheck();
    });
  }
}
