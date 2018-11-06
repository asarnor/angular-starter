import { AfterViewInit, Component, Input, ViewChild, ViewContainerRef } from '@angular/core';
import { DynamicComponentService } from '../../dynamic-component-loader/dynamic-component-loader.service';

@Component({
  selector: 'app-dialog-component',
  template: '<div #outlet></div>',
})
export class ModalContentComponent implements AfterViewInit {

  @ViewChild('outlet', { read: ViewContainerRef }) _outlet: ViewContainerRef;
  @Input() private modalId: string;

  constructor(private loader: DynamicComponentService) {
  }

  ngAfterViewInit() {
    /** Load the component based on the ID passed */
    this.loader.getComponentFactory(this.modalId)
      .subscribe(factory =>
        this._outlet.createComponent(factory)
          .changeDetectorRef.detectChanges(),
      );


  }
}
