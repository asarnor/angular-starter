import { Marker } from 'mapbox-gl';

declare namespace Mapbox {
  interface MarkerWithLocation extends Marker {
    location?: Models.LocationMLS;
  }
}
