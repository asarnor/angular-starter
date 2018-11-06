/**
 * From https://github.com/devboosts/dynamic-component-loader
 */

import {
  ANALYZE_FOR_ENTRY_COMPONENTS,
  ModuleWithProviders,
  NgModule,
  NgModuleFactoryLoader,
  SystemJsNgModuleLoader,
  Type,
} from '@angular/core';
import { ROUTES } from '@angular/router';

import {
  DYNAMIC_COMPONENT,
  DYNAMIC_COMPONENT_MANIFESTS,
  DYNAMIC_MODULE,
  DynamicComponentManifest,
} from './dynamic-component-loader.model';
import { DynamicComponentService } from './dynamic-component-loader.service';

@NgModule()
export class DynamicComponentLoaderModule {
  static forRoot(manifests: DynamicComponentManifest[]): ModuleWithProviders {
    return {
      ngModule: DynamicComponentLoaderModule,
      providers: [
        DynamicComponentService,
        { provide: NgModuleFactoryLoader, useClass: SystemJsNgModuleLoader },
        // provider for Angular CLI to analyze
        { provide: ROUTES, useValue: manifests, multi: true },
        // provider for DynamicComponentLoader to analyze
        { provide: DYNAMIC_COMPONENT_MANIFESTS, useValue: manifests },
      ],
    };
  }
  static forModule(manifest: DynamicComponentManifest): ModuleWithProviders {
    return {
      ngModule: DynamicComponentLoaderModule,
      providers: [
        { provide: ANALYZE_FOR_ENTRY_COMPONENTS, useValue: manifest, multi: true },
        // provider for @angular/router to parse
        { provide: ROUTES, useValue: manifest, multi: true },
        // provider for DynamicComponentLoader to analyze
        { provide: DYNAMIC_MODULE, useValue: manifest }],
    };
  }
  static forChild(component: Type<any>): ModuleWithProviders {
    return {
      ngModule: DynamicComponentLoaderModule,
      providers: [
        { provide: ANALYZE_FOR_ENTRY_COMPONENTS, useValue: component, multi: true },
        // provider for @angular/router to parse
        { provide: ROUTES, useValue: [], multi: true },
        // provider for DynamicComponentLoader to analyze
        { provide: DYNAMIC_COMPONENT, useValue: component },
      ],
    };
  }
}

export { DynamicComponentManifest } from './dynamic-component-loader.model';
