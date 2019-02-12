import { Models } from '$models';

export declare namespace AppStore {
  /*************************
   * App specific interfaces
   *************************/

  /** API Store */
  export interface Api {
    [key: string]: ApiState<any>;
    //users?: any[]; // Store response
    // Example of Store typing with mapped response
    users?: ApiState<Models.User[]>;
  }

  /** UI Store */
  export interface Ui {
    /** A static snapshot of the UI store, used mainly for multiscreen usage */
    saveState: Ui | null;
    gridState: GridState | null;
    modal: {
      modalId: string;
      options: {};
      data: any;
    } | null;
    tabsActive: { [key: string]: number | null };
    toggles: { [key: string]: boolean | null };
  }

  /*************************
   * Non-customizable interfaces
   *************************/

  /** The root store which contains the other stores */
  interface Root {
    api: Api;
    ui: Ui;
  }

  export interface ApiState<T> {
    loading?: boolean;
    data?: T;
    error?: any;
    errorModifying?: any;
    modifying?: boolean;
    success?: boolean;
    entities?: {
      [key: string | number]: T;
    };
    ids?: string | number[];
  }

  interface Toggles {
    prop: string;
    value: boolean;
  }

  export interface ApiResponse {
    apiMap: ApiMap;
    data?: any;
  }

  /** Maps the relationship between the store and the API. Automates all the interaction. */
  export interface ApiMap {
    /** The location of the rest API endpoint */
    endpoint: string;
    /** The location/property of where to put the API response into the store */
    storeProperty: string;
    /** A unique ID of each object in the collection. Also supports an array of strings if multiple unique ID's are needed in the event of a single key not being enough. */
    uniqueId?: string | string[];
    /** The location of the rest API endpoint */
    entity?: EntityAdapter;
    /** Should new data be added to the existing store data without removing existing data first? If true, data will need to be manually removed from the store with api.storeDataRemove() */
    persistData?: boolean;
    /** Map the data before returning to store. This is usually used to extra data from a nested property. IE response => {data: [] } */
    map?: (data: any) => any;
  }
}
