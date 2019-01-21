import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-toggles',
  templateUrl: './toggles.component.html',
  styleUrls: ['./toggles.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TogglesComponent implements OnInit {

  @Input() locations: Map.Location[];

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
  
  public propTypeChanged() {

  }

}
