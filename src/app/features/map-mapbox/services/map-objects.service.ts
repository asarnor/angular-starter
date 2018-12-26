import { Injectable } from '@angular/core';
import { Map } from 'mapbox-gl';

@Injectable()
export class MapObjectsService {
  constructor() {}

  /**
   * Add markers to a map instance
   * @param map
   * @param locations
   */
  public addMarkers(map: Map, locations: Map.Location[]) {
    if (locations) {
      // Create markers with popups
      const markers = this.createMarker(locations);
      // Add markers to map
      markers.forEach(marker => marker.addTo(map));
    }
  }

  /**
   * Create a map marker and add to map
   * @param map
   * @param locations
   */
  private createMarker(locations: Map.Location[]) {
    return locations.map(location => {
      if (location.latitude && location.longitude) {
        const el = document.createElement('div');
        el.className = 'marker';
        // make a marker for each feature and add to the map
        const marker = new (<any>window).mapboxgl.Marker(el).setLngLat([location.longitude, location.latitude]);
        // If metadata available, create popup
        if (location.metadata && location.metadata.title) {
          this.createPopup(marker, location);
        }
        return marker;
      }
    });
  }

  /**
   * Add a popup to a marker if metadata is available
   * @param marker
   * @param location
   */
  private createPopup(marker: any, location: Map.Location) {
    // Hold html string for building
    let html = '';
    // Add title if available
    if (location.metadata && location.metadata.title) {
      html += '<h3>' + location.metadata.title + '</h3>';
    }
    // Add description if available
    if (location.metadata && location.metadata.description) {
      html += '<div>' + location.metadata.description + '</div>';
    }
    // add popups
    marker.setPopup(new (<any>window).mapboxgl.Popup({ offset: 25 }).setHTML(html));
  }
}
