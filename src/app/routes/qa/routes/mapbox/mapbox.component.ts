import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-mapbox',
  templateUrl: './mapbox.component.html',
  styleUrls: ['./mapbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapboxComponent implements OnInit {
 
  public locations: any[];
  private locationsOriginal: any[];

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

    this.http.get<Models.LocationMLS[]>('assets/mock-data/properties.json').subscribe(locations => {
      this.locationsOriginal = locations.map(location => {
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
      this.locationsOriginal.length = 500;
      this.ref.markForCheck();
    });
  }

  /**
   * 
   * @param val 
   */
  public locationsSearch() {
    this.locations = [...this.locationsOriginal];
    this.sidebarMobileShow = false;
    this.ref.markForCheck();
  }
}
