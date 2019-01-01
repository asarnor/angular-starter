import { Component, OnInit, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SidebarComponent implements OnInit {

  public heatMap = true;

  @Input() formSearch: FormGroup;
  @Input() locations: Models.LocationMLS[];

  @Output() submit = new EventEmitter<any>();
  @Output() listingSelected = new EventEmitter<Models.LocationMLS>();
  @Output() toggleSelected = new EventEmitter<{event: string, data?: any}>();

  constructor() { }

  ngOnInit() {
  }

  public submitForm(e: Event) {
    this.submit.emit(this.formSearch.value);
    e.stopPropagation();
    e.preventDefault();
  }

}
