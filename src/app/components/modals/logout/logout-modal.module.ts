import { NgModule } from '@angular/core'
import { LogoutModalComponent } from './logout-modal.component';
import { DynamicComponentLoaderModule } from '../../../dynamic-component-loader/dynamic-component-loader.module';

@NgModule({
  declarations: [
    LogoutModalComponent,
  ],
  imports: [
    DynamicComponentLoaderModule.forChild(LogoutModalComponent),
  ],
})
export class LogoutModalModule {
}
