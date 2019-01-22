import { Component, OnInit, ChangeDetectionStrategy, Input, EventEmitter, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-toggles',
  templateUrl: './toggles.component.html',
  styleUrls: ['./toggles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TogglesComponent implements OnInit {
  @Input() locations: Map.Location[];
  @Input() formSearch: FormGroup;
  @Output() toggleSelected = new EventEmitter<{ event: string; data?: any }>();

  public toggleMenu: { [key: string]: boolean } = {
    rogListings: false,
    mlsStatus: false,
    daysOnMarket: false,
    beds: false,
    baths: false,
    price: false,
    sqft: false,
    propertyType: false,
  };

  public toggleBackgroundShow = false;

  public toggleActive: { [key: string]: boolean } = {
    rogListings: false,
    heatmap: false,
    mlsStatusActive: true,
    mlsStatusPending: false,
    mlsStatusWithdrawn: false,
    mlsStatusSold: false,
  };

  constructor() {}

  ngOnInit() {
    // this.formSearch.valueChanges.subscribe(() => this.toggleBackgroundShow = false);
  }

  public formReset() {
    this.formSearch.patchValue({
      bathsMax: '',
      bathsMin: '',
      bedroomsMax: '',
      bedroomsMin: '',
      days_on_market: '2',
      homeTypes: null,
      isBrand: false,
      is_condo: true,
      is_multi_family: true,
      is_single_family: true,
      is_townhouse: true,
      listing_status_active: true,
      listing_status_pending: true,
      listing_status_sold: true,
      listing_status_withdrawn: true,
      priceHigh: '',
      priceLow: '',
      sqFootageMax: '',
      sqFootageMin: '',
    });
  }

  /**
   * Open a flyout menu, close all others first
   * @param key
   * @param val
   */
  public toggleOpen(key?: string, val?: boolean) {
    this.toggleBackgroundShow = false;
    // Disable all flyouts
    this.toggleClose();
    if (key && val) {
      const toggleMenu = { ...this.toggleMenu };
      toggleMenu[key] = val;
      this.toggleMenu = toggleMenu;
      this.toggleBackgroundShow = true;
    }
  }

  /**
   * Change a value on the form
   * @param field
   * @param value
   */
  public formChangeValue(field: string, value: string | number | boolean) {
    const obj: { [key: string]: any } = {};
    obj[field] = value;
    this.formSearch.patchValue(obj);
  }

  /** Close all toggles */
  public toggleClose() {
    const toggleMenu = { ...this.toggleMenu };
    Object.keys(toggleMenu).forEach(key2 => (toggleMenu[key2] = false));
    this.toggleMenu = toggleMenu;
  }
}
