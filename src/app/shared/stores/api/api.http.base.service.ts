import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';

import { Observable, of, throwError } from 'rxjs';
import { catchError, map, share } from 'rxjs/operators';

import { ApiStoreActions } from './api.actions';
import { AppStore } from '../store';

@Injectable()
export class ApiHttpService {
  /** Hold GET requests from an API using the URL as a primary key */
  private cache: { [key: string]: any } = {};

  constructor(private httpSvc: HttpClient, private storeSvc: Store<AppStore.Root>) {}

  /**
   * Make a GET request with simple caching
   * @param url - The URL location of the webapi
   * @param updateCache - Refresh the version in the cache
   */
  public get<T>(url: string, updateCache = false): Observable<T> {
    // If this request is not in the cache or updateCache was requested (default behavior), load content into cache
    if (!this.cache[url] || updateCache) {
      this.cache[url] = this.httpSvc.get(url).pipe(share());
    }
    return of(this.cache[url]); // Return observable of api response
  } // end get

  /**
   * Make a GET request and load the results into the store
   * @param url - The URL location of the webapi
   * @param id - The location to put the results in the store
   * @param updateCache - Refresh the version in the cache
   */
  protected getStore<T>(url: string, apiMap?: AppStore.ApiMap, updateCache = false): Observable<T> {
    // If this request is not in the cache or updateCache was requested (default behavior), load content into cache
    if (this.cache[url] == null || updateCache) {
      // Set loading
      this.storeSvc.dispatch(ApiStoreActions.STATE_LOADING({ apiMap: apiMap }));
      // Load into cache, make get request
      return this.httpSvc.get(url).pipe(
        map(res => {
          const data = apiMap.map ? apiMap.map(res) : res;
          this.storeSvc.dispatch(ApiStoreActions.GET_COMPLETE({ apiMap: apiMap, data: data }));
          this.cache[url] = res; // Cache api response
          return res;
        }),
        catchError(error => {
          this.storeSvc.dispatch(ApiStoreActions.STATE_ERROR_GET({ apiMap: apiMap, data: error }));
          // Observable type is being set in the http interceptor so cast to any here
          return <Observable<any>>throwError(error);
        }),
        share(),
      );
    } else {
      // If map method specified, grab that out of cache instead
      const data = apiMap.map ? apiMap.map(this.cache[url]) : this.cache[url];
      // Update store with cached data
      this.storeSvc.dispatch(ApiStoreActions.GET_COMPLETE({ apiMap: apiMap, data: data }));
      return of(this.cache[url]); // Return observable of api response
    }
  }

  /**
   * Make a POST request and load the results into the store
   * @param url - The URL location of the endpoint
   * @param id - The location to put the results in the store
   * @param data - The data to pass to the server
   */
  protected postStore<T>(url: string, apiMap: AppStore.ApiMap, data: T): Observable<T> {
    // Update store with new state
    this.storeSvc.dispatch(ApiStoreActions.STATE_MODIFYING({ apiMap: apiMap }));

    return this.httpSvc.post(url, data).pipe(
      map((res: any) => {
        // Check if the response has a payload or not
        const dataNew = res ? res : data;
        this.storeSvc.dispatch(ApiStoreActions.POST_COMPLETE({ apiMap: apiMap, data: dataNew }));
        return dataNew;
      }),
      catchError(error => {
        this.storeSvc.dispatch(ApiStoreActions.STATE_ERROR_MODIYFING({ apiMap: apiMap, data: error }));
        // Observable type is being set in the http interceptor so cast to any here
        return <Observable<any>>throwError(error);
      }),
    );
  } // end post

  /**
   * Make a PUT request
   * @param url - The URL location of the webapi
   * @param data - The data to pass to the server
   */
  protected putStore<T>(url: string, apiMap: AppStore.ApiMap, data: T | T[]): Observable<T> {
    // Update store with new state
    this.storeSvc.dispatch(ApiStoreActions.STATE_MODIFYING({ apiMap: apiMap }));

    return this.httpSvc.put(url, data).pipe(
      map(res => {
        // Check if the response has a payload or not,
        const dataNew = res ? res : data;
        this.storeSvc.dispatch(ApiStoreActions.PUT_COMPLETE({ apiMap: apiMap, data: dataNew }));
        return dataNew;
      }),
      catchError(error => {
        this.storeSvc.dispatch(ApiStoreActions.STATE_ERROR_MODIYFING({ apiMap: apiMap, data: error }));
        // Observable type is being set in the http interceptor so cast to any here
        return <Observable<any>>throwError(error);
      }),
    );
  } // end put

  /**
   * Make an upsert via put. Upsert inserts if not found, updates if found
   * @param url - The URL location of the webapi
   * @param data - The data to pass to the server
   */
  protected upsertStore<T>(url: string, apiMap: AppStore.ApiMap, data: T | T[]): Observable<T> {
    // Update store with new state
    this.storeSvc.dispatch(ApiStoreActions.STATE_MODIFYING({ apiMap: apiMap }));
    // Upsert is patch
    return this.httpSvc.patch(url, data).pipe(
      map(res => {
        // Check if the response has a payload or not, if not then this is an upSert
        const dataNew = res ? res : data;
        this.storeSvc.dispatch(ApiStoreActions.UPSERT_COMPLETE({ apiMap: apiMap, data: dataNew }));
        return dataNew;
      }),
      catchError(error => {
        this.storeSvc.dispatch(ApiStoreActions.STATE_ERROR_MODIYFING({ apiMap: apiMap, data: error }));
        // Observable type is being set in the http interceptor so cast to any here
        return <Observable<any>>throwError(error);
      }),
    );
  } // end put

  /**
   * Make a DELETE request
   * @param url - The URL location of the webapi
   * @param apiMap - The ApiMap object
   * @param element - The element or collection of elements being deleted
   */
  protected deleteStore<T>(url: string, apiMap: AppStore.ApiMap, element: T | T[]) {
    // Update store with new state
    this.storeSvc.dispatch(ApiStoreActions.STATE_MODIFYING({ apiMap: apiMap }));
    // Delete doesn't natively support a body so this adds it in for deleting collections or other uncommon operations
    return this.httpSvc.request('delete', url, { body: element }).pipe(
      // return this.httpSvc.delete(url, , { body: element }) // Does not work with body, add back in when it does
      map(res => {
        this.storeSvc.dispatch(ApiStoreActions.DELETE_COMPLETE({ apiMap: apiMap, data: element }));
        return res;
      }),
      catchError(error => {
        this.storeSvc.dispatch(ApiStoreActions.STATE_ERROR_MODIYFING({ apiMap: apiMap, data: error }));
        // Observable type is being set in the http interceptor so cast to any here
        return <Observable<any>>throwError(error);
      }),
    );
  } // end post

  /**
   * Clear the cache
   */
  public cacheClear() {
    this.cache = {};
  }
}
