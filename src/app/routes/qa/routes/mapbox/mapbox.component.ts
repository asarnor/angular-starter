import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ListingModalComponent } from './components/listing-modal/listing-modal.component';

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
  public listingModal: MatDialogRef<ListingModalComponent>;

  constructor(private fb: FormBuilder, private http: HttpClient, public dialog: MatDialog, private ref: ChangeDetectorRef) {}

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
       
        const officeName = location.office_name.toLowerCase().replace(/[^A-Z0-9]/ig, '');
        // console.log(location.office_name, officeName);
        return {
          ...location,
          metadata: {
            title: location.display_address,
            description: location.city + ', ' + location.county + ' ' + location.zip_code,
            iconClass: officeName.indexOf('realtyonegroup') !== -1 ? 'marker rog' : null
          },
          latitude: location.display_lat,
          longitude: location.display_lng,
        };
      });
      this.locationsOriginal.length = 500;
      // this.locations = [...this.locationsOriginal];
      this.ref.markForCheck();
    });
  }

  /**
   * When a listing is selected or clicked from the list of listings
   * @param listing 
   */
  public listingSelected(listing: Models.LocationMLS) {
    this.listingModal = this.dialog.open(ListingModalComponent, {
      width: '90%',
      data: listing
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
