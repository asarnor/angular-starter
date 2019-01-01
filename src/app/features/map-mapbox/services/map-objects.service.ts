import { Injectable } from '@angular/core';
import { Map, Marker } from 'mapbox-gl';

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
      return markers;
    }
  }

  /**
   * Fit the map to container the markers
   * @param map
   * @param markers
   */
  public mapFitBounds(map: Map, markers: Marker[]) {
    if (markers && markers.length) {
      setTimeout(() => {
        // Rotate to 0
        map.rotateTo(0, { duration: 500 });
        // After rotation is finished, go to bounds
        setTimeout(() => {
          const bounds = new (<any>window).mapboxgl.LngLatBounds();
          markers.forEach(feature => {
            bounds.extend(feature.getLngLat());
          });
          map.fitBounds(bounds);
        }, 500);
      }, 100);

    }
  }

  /**
   * Fly to a location on a map
   * @param map
   * @param coords
   */
  public flyToLocation(map: Map, coords: [number, number]) {
    setTimeout(() => {
      map.rotateTo(0, { duration: 500 });
      setTimeout(() => {
        map.flyTo({
          center: coords,
          zoom: 10,
          pitch: 0,
          speed: 2.2,
          curve: 1.42,
          easing(t: any) {
            return t;
          },
        });
      }, 500);
    }, 100);
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
        el.className = location.metadata && location.metadata.iconClass ? location.metadata.iconClass : 'marker';
        // make a marker for each feature and add to the map
        const marker: Marker = new (<any>window).mapboxgl.Marker(el).setLngLat([location.longitude, location.latitude]);
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
