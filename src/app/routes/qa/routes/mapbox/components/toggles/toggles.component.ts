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

  constructor() { }

  ngOnInit() {
  }

}
