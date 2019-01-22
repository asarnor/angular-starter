import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ListingModalComponent } from './components/listing-modal/listing-modal.component';
import { AutoUnsubscribe } from 'ngx-auto-unsubscribe';

@AutoUnsubscribe()
@Component({
  selector: 'app-mapbox',
  templateUrl: './mapbox.component.html',
  styleUrls: ['./mapbox.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapboxComponent implements OnInit {
  public locations: Models.LocationMLS[];
  public locationsOriginal: Models.LocationMLS[];

  public sidebarMobileShow = false;

  public formSearch: FormGroup;
  public listingModal: MatDialogRef<ListingModalComponent>;

  public heatmap = false;
  public mapStyle = 'streets';
  public flyTo: { zoom: number; coords: [number, number] };

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    public dialog: MatDialog,
    private ref: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    // Create searchable locations
    this.formSearch = this.fb.group({
      zip: [{ value: '89147', disabled: false }, []],
      isBrand: [false, []],
      priceLow: ['', []],
      priceHigh: ['', []],
      bedroomsMin: ['', []],
      bedroomsMax: ['', []],
      bathsMin: ['', []],
      bathsMax: ['', []],
      days_on_market: ['2', []],
      homeTypes: [null, []],
      sqFootageMin: ['', []],
      sqFootageMax: ['', []],
      listing_status_active: [true, []],
      listing_status_pending: [true, []],
      listing_status_withdrawn: [true, []],
      listing_status_sold: [true, []],
      is_single_family: [true, []],
      is_multi_family: [true, []],
      is_townhouse: [true, []],
      is_condo: [true, []],
    });
    this.formSearch.controls['zip'].disable();

    this.formSearch.valueChanges.subscribe(() => {
      this.locationsSearch();
    });

    this.http.get<Models.LocationMLS[]>('assets/mock-data/properties.json').subscribe(locations => {
      this.locationsOriginal = locations.map(location => {
        const officeName = location.office_name.toLowerCase().replace(/[^A-Z0-9]/gi, '');
        // console.log(location.office_name, officeName);
        return {
          ...location,
          // thumbnail_url: location.thumbnail_url.replace('http', 'https'), // Make images https
          metadata: {
            title: location.display_address,
            description: location.city + ', ' + location.county + ' ' + location.zip_code,
            iconClass: officeName.indexOf('realtyonegroup') !== -1 ? 'marker rog ' : null,
            isBrand: officeName.indexOf('realtyonegroup') !== -1 ? true : false,
          },
          latitude: location.display_lat,
          longitude: location.display_lng,
        };
      });
      // this.locations = [...this.locationsOriginal];
      this.locationsSearch();
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
      coords: [location.display_lng, location.display_lat],
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

  /**
   *
   * @param listing
   */
  public modalOpen(listing: Models.LocationMLS) {
    this.listingModal = this.dialog.open(ListingModalComponent, {
      width: '95%',
      maxHeight: '90vh',
      data: listing,
    });
  }

  /**
   * Search locations
   * @param val
   */
  public locationsSearch() {
    // this.locations = [...this.locationsOriginal];

    const formValue = this.formSearch.getRawValue();
    this.locations = this.locationsOriginal.filter(location => {
      // Zip code check
      if (formValue.zip.toString() !== '' && location.zip_code.toString() !== formValue.zip.toString()) {
        // return false;
      }

      // Check if this is a branded location
      // if ((this.listingsShowAll && listing.metadata.isBrand) || !this.listingsShowAll) {
      if (formValue.isBrand === true && location.metadata.isBrand !== true) {
        return false;
      }

      const price = parseInt(location.listing_price.split('.')[0].replace(/[^a-zA-Z0-9]/g, ''));

      // Low price check
      if (formValue.priceLow !== '' && price < parseInt(formValue.priceLow)) {
        return false;
      }

      // Low price check
      if (formValue.priceHigh !== '' && price > parseInt(formValue.priceHigh)) {
        return false;
      }

      // Min bedrooms
      if (formValue.bedroomsMin !== '' && location.total_bedrooms < parseInt(formValue.bedroomsMin)) {
        return false;
      }

      // Min bedrooms
      if (formValue.bedroomsMax !== '' && location.total_bedrooms > parseInt(formValue.bedroomsMax)) {
        return false;
      }

      // Min baths
      if (formValue.bathsMin !== '' && location.total_bathrooms < parseInt(formValue.bathsMin)) {
        return false;
      }

      // Min baths
      if (formValue.bathsMax !== '' && location.total_bathrooms > parseInt(formValue.bathsMax)) {
        return false;
      }

      // Min sq ft
      if (formValue.sqFootageMin !== '' && location.square_feet < parseInt(formValue.sqFootageMin)) {
        return false;
      }

      // Max sq ft
      if (formValue.sqFootageMax !== '' && location.square_feet > parseInt(formValue.sqFootageMax)) {
        return false;
      }

      // Days on market
      if (formValue.days_on_market !== '') {
        // Under 30
        if (formValue.days_on_market === '0' && location.days_on_market > 30) {
          return false;
          // Between 31 and 60
        } else if (
          formValue.days_on_market === '1' &&
          (location.days_on_market > 60 || location.days_on_market <= 31)
        ) {
          return false;
          // Over 90
        } else if (formValue.days_on_market === '2' && location.days_on_market < 90) {
          return false;
        }
      }

      // Only one status type has to match
      let statusMatch = false;

      // Listing Status Active
      if (formValue.listing_status_active === true && location.listing_status === 'Active') {
        statusMatch = true;
      }

      // Listing Status Pending
      if (formValue.listing_status_pending === true && location.listing_status === 'Pending') {
        statusMatch = true;
      }

      // Listing Status Sold
      if (formValue.listing_status_sold === true && location.listing_status === 'Sold') {
        statusMatch = true;
      }

      // Listing Status Withdrawn
      if (formValue.listing_status_withdrawn === true && location.listing_status === 'Withdrawn') {
        statusMatch = true;
      }

      if (!statusMatch) {
        return false;
      }

      // Home types need to match on ANY, if a single hometype parameter matches then return true
      let hasHomeType = false;

      // Single family
      if (formValue.is_single_family !== false && location.is_single_family !== '') {
        hasHomeType = true;
      }

      // Multi-family
      if (formValue.is_multi_family !== false && location.is_multi_family !== '') {
        hasHomeType = true;
      }

      // Townhomes
      if (formValue.is_townhouse !== false && location.is_townhouse !== '') {
        hasHomeType = true;
      }

      // Condos
      if (formValue.is_condo !== false && location.is_condo !== '') {
        hasHomeType = true;
      }

      // If ALL hometypes are false then show all
      if (
        formValue.is_single_family === false &&
        formValue.is_multi_family === false &&
        formValue.is_townhouse === false &&
        formValue.is_condo === false
      ) {
        // hasHomeType = true;
      }

      if (!hasHomeType) {
        return false;
      }

      return true;
    });
    this.sidebarMobileShow = false;
    document.getElementById('map-container').scrollTo({ top: 0, behavior: 'smooth' });
  }

  /** When a toggle event is emitted up from the toggles component */
  public toggleSelected(action: { event: 'heatmap' | 'mapStyle'; data?: any }) {
    switch (action.event) {
      case 'heatmap':
        this.heatmap = !this.heatmap;
        break;
      case 'mapStyle':
        this.mapStyle = action.data;
        break;
    }
  }

  /**
   * Only show Rog listings
  public toggleRogListings() {
    this.locations = this.locationsOriginal.filter(listing => {
      if ((this.listingsShowAll && listing.metadata.isBrand) || !this.listingsShowAll) {
        return true;
      }
      return false;
    });
    this.listingsShowAll = !this.listingsShowAll;
  }
   */
}
