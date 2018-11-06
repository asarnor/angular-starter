import { NgModule } from '@angular/core'
import { ConfirmationModalComponent } from './confirmation-modal.component';
import { DynamicComponentLoaderModule } from '../../../dynamic-component-loader/dynamic-component-loader.module';

@NgModule({
  declarations: [
    ConfirmationModalComponent,
  ],
  imports: [
    DynamicComponentLoaderModule.forChild(ConfirmationModalComponent),
  ],
})
export class ConfirmationModalModule {
}
