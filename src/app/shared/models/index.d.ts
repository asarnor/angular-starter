/**
 * Generate models with NSwagStudio: https://github.com/RSuter/NSwag/wiki/NSwagStudio
 * Make sure to point at the docs url in the top green header
 * IE http://localhost:57462/swagger/docs/v1
 * NOT http://localhost:57462/swagger/ui/index#/

 Config Options:
  - Set namespace to Models
  - TS version 2.7
  - Generate DTO types: Checked
  - Type Style: Interface
  - Null Value: Null
  - Leave everything else blank or unchecked here
 */

declare namespace Models {
  /********************************
   *  BEGIN NSWAG STUDIO COPY/PASTE
   ********************************/
  export interface LocationMLS {
    city?: string;
    county?: string;
    days_on_market?: number;
    display_address?: string;
    display_lat?: number;
    display_lng?: number;
    hoa_fee?: string;
    is_condo?: string;
    state?: string;
    is_condo_townhouse?: string;
    is_lot?: string;
    is_multi_family?: string;
    listing_office_name?: string;
    office_name?: string;
    is_single_family?: string;
    is_townhouse?: string;
    listing_price?: string;
    listing_status?: string;
    listing_status_standardized?: string;
    lot_dimension?: string;
    photo_url?: string;
    photos?: string;
    property_id?: number;
    square_feet?: number;
    thumbnail_url?: string;
    total_bathrooms?: number;
    total_bedrooms?: number;
    year_built?: string;
    zip_code?: number;
    metadata?: any;
  }

  export interface User {
    id: number;
    name?: string;
    username: string;
    email?: string;
    address?: {
      street?: string;
      suite?: string;
      city?: string;
      zipcode?: string;
      geo?: {
        lat?: string;
        lng?: string;
      };
    };
    phone?: string;
    website?: string;
    company?: {
      name?: string;
      catchPhrase?: string;
      bs?: string;
    };
  }
  /********************************
   *  END NSWAG STUDIO COPY/PASTE
   ********************************/
}
