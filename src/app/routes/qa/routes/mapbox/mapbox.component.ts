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
 
  public locations: Map.Location[];
  private locationsOriginal: Map.Location[];

  public sidebarMobileShow = false;

  public formSearch: FormGroup;
  public listingModal: MatDialogRef<ListingModalComponent>;
  /** Show all listings or just ROG ones */
  public listingsShowAll = true;

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
          // thumbnail_url: location.thumbnail_url.replace('http', 'https'), // Make images https
          metadata: {
            title: location.display_address,
            description: location.city + ', ' + location.county + ' ' + location.zip_code,
            iconClass: officeName.indexOf('realtyonegroup') !== -1 ? 'marker rog' : null,
            isRog:  officeName.indexOf('realtyonegroup') !== -1 ? true : false
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
   * Search locations
   * @param val 
   */
  public locationsSearch() {
    this.locations = [...this.locationsOriginal];
    this.sidebarMobileShow = false;
    document.getElementById('map-container').scrollTo({ top: 0, behavior: 'smooth' });
  }

  public toggleSelected(action: {event: string, data?: any}) {
    console.log(action);
    this.toggleRogListings();
  }

  /**
   * Only show Rog listings
   */
  public toggleRogListings() {
    this.locations = this.locationsOriginal.filter(listing => {
      if ((this.listingsShowAll && listing.metadata.isRog) || !this.listingsShowAll) {
        return true;
      }
      return false;
    });
    this.listingsShowAll = !this.listingsShowAll;
  }
}
