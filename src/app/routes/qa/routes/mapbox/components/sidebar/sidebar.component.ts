import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatButtonToggleChange } from '@angular/material';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidebarComponent implements OnInit {
  public heatMap = true;

  @Input() formSearch: FormGroup;
  @Input() locations: Models.LocationMLS[];

  @Output() submit = new EventEmitter<any>();
  @Output() listingSelected = new EventEmitter<Models.LocationMLS>();
  @Output() toggleSelected = new EventEmitter<{ event: string; data?: any }>();

  constructor() {}

  ngOnInit() {}

  /**
   * When prop type changes, update form. Button toggle does not support reactive forms
   * @param change
   * @param type
   */
  public propTypeChanged(change: MatButtonToggleChange, type: string) {
    const val: { [key: string]: boolean } = {};
    val[type] = change.source.checked;
    this.formSearch.patchValue(val);
  }

  public submitForm(e: Event) {
    this.submit.emit(this.formSearch.value);
    e.stopPropagation();
    e.preventDefault();
  }
}
