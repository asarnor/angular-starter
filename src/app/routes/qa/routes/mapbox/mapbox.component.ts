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
  public locationsOriginal: Map.Location[];

  public sidebarMobileShow = false;

  public formSearch: FormGroup;
  public listingModal: MatDialogRef<ListingModalComponent>;
  /** Show all listings or just ROG ones */
  public listingsShowAll = true;
  public heatmap = false;
  public flyTo: { zoom: number, coords: [number, number] };

  constructor(private fb: FormBuilder, private http: HttpClient, public dialog: MatDialog, private ref: ChangeDetectorRef) {}

  ngOnInit() {
    // Create searchable locations
    this.formSearch = this.fb.group({
      zip: [{value: '89147', disabled: true}, []],
      priceLow: ['', []],
      priceHigh: ['', []],
      bedroomsMin: ['', []],
      bedroomsMax: ['', []],
      bathsMin: ['', []],
      bathsMax: ['', []],
      homeTypes: ['', []],
      sqFootageMin: ['', []],
      sqFootageMax: ['', []],
      is_single_family: ['Y', []],
      is_multi_family: [false, []],
      is_townhouse: [false, []],
      is_condo: [false, []],
    });

    this.formSearch.valueChanges.subscribe(val => console.log(val));

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
            iconClass: officeName.indexOf('realtyonegroup') !== -1 ? 'marker rog ' : null,
            isBrand:  officeName.indexOf('realtyonegroup') !== -1 ? true : false
          },
          latitude: location.display_lat,
          longitude: location.display_lng,
        };
      });
      this.locationsOriginal.length = 500;
      this.locations = [...this.locationsOriginal];
      this.ref.markForCheck();
    });
  }

  /**
   * When a listing is selected or clicked from the list of listings
   * @param listing 
   */
  public listingSelected(location: Models.LocationMLS) {
    this.flyTo = {
      zoom: 15.5,
      coords: [location.display_lng, location.display_lat]
    };
    this.modalOpen(location);
  }

  /**
   * When a pin click is emitted up from the map component
   * @param location 
   */
  public pinClicked(location: Models.LocationMLS) {
    this.modalOpen(location);
  }

  public modalOpen(listing: Models.LocationMLS) {
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


  /** When a toggle event is emitted up from the toggles component */
  public toggleSelected(action: {event: 'listingsRog' | 'heatmap', data?: any}) {
    switch (action.event) {
      case 'listingsRog':
      this.toggleRogListings();
      break;
      case 'heatmap':
      this.heatmap = !this.heatmap;
      break;
    }
    
  }

  /**
   * Only show Rog listings
   */
  public toggleRogListings() {
    this.locations = this.locationsOriginal.filter(listing => {
      if ((this.listingsShowAll && listing.metadata.isBrand) || !this.listingsShowAll) {
        return true;
      }
      return false;
    });
    this.listingsShowAll = !this.listingsShowAll;
  }
}
