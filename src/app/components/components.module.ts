import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VendorModule } from '../vendor.module';
import { SharedModule } from '$shared';

// Layout
import { FooterComponent } from './masterpage/footer/footer.component';
import { HeaderComponent } from './masterpage/header/header.component';
import { LayoutMainComponent } from './masterpage/main/layout-main.component';
import { LayoutSingleComponent } from './masterpage/single/layout-single.component';
import { NavComponent } from './masterpage/nav/nav.component';
import { NavSearchComponent } from './masterpage/nav/search/nav-search.component';

// Components
import { ApiStateComponent } from './api-state/api-state.component';
import { CounterComponent } from './counter/counter.component';

// Form Tools
import { MaterialsModule } from './materials/materials.module';

// Components to include
export const APP_COMPONENTS = [
  FooterComponent,
  HeaderComponent,
  LayoutMainComponent,
  LayoutSingleComponent,
  NavComponent,
  NavSearchComponent,
  ApiStateComponent,
  CounterComponent,
];

@NgModule({
  imports: [
    // Angular
    CommonModule,
    // Shared
    SharedModule,
    // Vendors
    VendorModule,
    MaterialsModule,
  ],
  providers: [],
  declarations: [APP_COMPONENTS],
  exports: [APP_COMPONENTS, MaterialsModule],
  entryComponents: [],
})
export class ComponentsModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ComponentsModule,
      providers: [],
    };
  }
}
