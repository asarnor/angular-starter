import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-toggles',
  templateUrl: './toggles.component.html',
  styleUrls: ['./toggles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TogglesComponent implements OnInit {

  @Input() locations: Map.Location[];
  @Input() formSearch: FormGroup;
  @Output() toggleSelected = new EventEmitter<{event: string, data?: any}>();

  public toggleMenu: { [key: string]: boolean} = {
    rogListings: false,
    mlsStatus: false,
    daysOnMarket: false,
    beds: false,
    baths: false,
    price: false,
    sqft: false,
    propertyType: false
  };

  public toggleBackgroundShow = false;

  public toggleActive: { [key: string]: boolean} = {
    rogListings: false,
    heatmap: false,
    mlsStatusActive: true,
    mlsStatusPending: false,
    mlsStatusWithdrawn: false,
    mlsStatusSold: false,
  };

  constructor() { }

  ngOnInit() {
    // this.formSearch.valueChanges.subscribe(() => this.toggleBackgroundShow = false);
  }


  /**
   * Open a flyout menu, close all others first
   * @param key 
   * @param val 
   */
  public toggleOpen(key?: string, val?: boolean) {
    this.toggleBackgroundShow = false;
    // Disable all flyouts
    Object.keys(this.toggleMenu).forEach(key2 => this.toggleMenu[key2] = false);
    if (key && val) {
      this.toggleMenu[key] = val;
      this.toggleBackgroundShow = true;
    }
  }

  /**
   * Change a value on the form
   * @param field 
   * @param value 
   */
  public formChangeValue(field: string, value: string | number | boolean) {
    const obj: { [key: string]: any} = {};
    obj[field] = value;
    this.formSearch.patchValue(obj);
  }
  
  public propTypeChanged() {

  }

}
