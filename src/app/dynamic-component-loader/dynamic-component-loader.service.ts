/**
 * From https://github.com/devboosts/dynamic-component-loader
 */

import { ComponentFactory, Inject, Injectable, Injector, NgModuleFactory, NgModuleFactoryLoader } from '@angular/core';
import { Observable, from as ObservableFromPromise, throwError as ObservableThrow } from 'rxjs';

import {
  DYNAMIC_COMPONENT,
  DYNAMIC_COMPONENT_MANIFESTS,
  DYNAMIC_MODULE,
  DynamicComponentManifest,
} from './dynamic-component-loader.model';

@Injectable()
export class DynamicComponentService {

  constructor(
    @Inject(DYNAMIC_COMPONENT_MANIFESTS) private manifests: DynamicComponentManifest[],
    private moduleFactoryLoader: NgModuleFactoryLoader,
    private injector: Injector,
  ) {
  }

  /**
   * Retrieve a ComponentFactory, based on the specified componentId (defined in the DynamicComponentManifest array)
   * @param componentId - Component ID defined in the DynamicComponentManifest array
   * @param injector
   */
  getComponentFactory<T>(componentId: string, injector?: Injector): Observable<ComponentFactory<T>> {
    const manifest = this.manifests.find(m => m.componentId === componentId);
    if (!manifest) {
      return ObservableThrow(`DynamicComponentService: Unknown componentId "${componentId}"`);
    }

    const path = manifest.loadChildren;
    const p = this.loadComponentFactoryFromPath<T>(path, componentId, injector);
    return ObservableFromPromise(p);
  }

  /**
   * Retrieve a ComponentFactory, based on the specified path and componentId (defined in the DynamicComponentManifest array)
   * @param path
   * @param componentId - Component ID defined in the DynamicComponentManifest array
   * @param injector
   */
  loadComponentFactoryFromPath<T>(path: string, componentId: string, injector?: Injector): Promise<ComponentFactory<T>> {
    return this.moduleFactoryLoader
      .load(path)
      .then((ngModuleFactory) => this.loadComponentFactoryFromModule<T>(ngModuleFactory, componentId, injector));
  }

  /**
   * Retrieve a ComponentFactory, based on the specified module factory and componentId (defined in the DynamicComponentManifest array).
   * This function is used in tandem with loadComponentFactoryFromPath to recursively traverse paths to resolve a component
   * factory that may be buried in submodules.
   * @param ngModuleFactory
   * @param componentId - Component ID defined in the DynamicComponentManifest array
   * @param injector
   */
  loadComponentFactoryFromModule<T>(ngModuleFactory: NgModuleFactory<any>, componentId: string, injector?: Injector): Promise<ComponentFactory<T>> {
    const moduleRef = ngModuleFactory.create(injector || this.injector);
    const dynamicComponentType = moduleRef.injector.get(DYNAMIC_COMPONENT, null);

    // The component was not found. We will attempt to find a module to traverse in order to find the matching componentId
    if (!dynamicComponentType) {

      const dynamicModule: DynamicComponentManifest = moduleRef.injector.get(DYNAMIC_MODULE, null);
      if (!dynamicModule) {
        throw new Error(
          `DynamicComponentService: Dynamic module for componentId "${componentId}" does not contain DYNAMIC_COMPONENT or DYNAMIC_MODULE as a provider.`,
        );
      }
      if (dynamicModule.componentId !== componentId) {
        throw new Error(
          `DynamicComponentService: Dynamic module for ${componentId} does not match manifest.`,
        );
      }

      const path = dynamicModule.loadChildren;
      if (!path) {
        throw new Error(`DynamicComponentService: Could not load children for ${componentId}.`);
      }

      // Use the new path to find the component
      return this.loadComponentFactoryFromPath<T>(path, componentId, injector);
    }

    // The component was found
    return Promise.resolve(moduleRef.componentFactoryResolver.resolveComponentFactory<T>(dynamicComponentType));
  }
}
