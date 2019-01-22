import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  AfterViewInit,
  ViewEncapsulation,
  OnChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { Map } from 'mapbox-gl';
import { MapObjectsService } from '../services/map-objects.service';
import { Mapbox } from '../mapbox';

const scriptSrc = 'https://api.mapbox.com/mapbox-gl-js/v0.52.0/mapbox-gl.js';
const apiKey = 'pk.eyJ1Ijoicm9ndXNlciIsImEiOiJjanB1YzFrMmwwZjZnNDNxbGkwY28wdnI5In0.Xe4QgRnvsvP3WAncobSxqg';

@Component({
  selector: 'app-map-mapbox',
  templateUrl: './map-mapbox.component.html',
  styleUrls: ['../../../../../node_modules/mapbox-gl/dist/mapbox-gl.css', './map-mapbox.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [MapObjectsService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MapMapboxComponent implements OnInit, AfterViewInit, OnChanges {
  /** Any locations such as pushpins or circles */
  @Input() locations: Map.Location[];
  /** Mapbox Api key */
  @Input() apiKey = apiKey;
  /** Default zoom level. 15.5 is optimical for 3d buildings */
  @Input() zoom = 15.5;
  /**Show/hide heatmap on default */
  @Input() style = 'streets';
  /**Show/hide heatmap on default */
  @Input() heatmap = false;
  /** Fly and zoom to this location, coords should be lat long */
  @Input() flyTo: { zoom: number; coords: [number, number] };
  /** When a pin is clicked on */
  @Output() pinClicked = new EventEmitter<any>();

  /** Has script loaded  */
  public isLoaded = false;
  /** Map reference */
  public map: Map;

  /** Randomly generated uniqueID for the div that holds the map. Allows for multiple map per page  */
  public uniqueId = 'map-box' + Math.floor(Math.random() * 1000000);

  private isRotating = true;
  /** Holds a reference to any created markers. Used to remove */
  private markers: Mapbox.MarkerWithLocation[];

  constructor(private mapObjects: MapObjectsService) {}

  ngOnInit() {}

  ngOnChanges(model: any) {
    // On style changes
    if (model.style && this.isLoaded) {
      this.map.setStyle(`mapbox://styles/mapbox/${this.style}-v9`);
    }

    // If locations change
    if (model.locations && this.isLoaded) {
      if (this.heatmap) {
        this.heatMapAdd();
      } else {
        this.isRotating = false;
        this.locationsAdd();
      }
    }

    // If heatmap toggle changes
    // TODO: Fix ugly nested if statements
    if (model.heatmap && this.isLoaded) {
      if (this.heatmap) {
        this.heatMapAdd();
      } else {
        this.heatMapRemove();
        if (this.locations) {
          this.locationsAdd();
        }
      }
    }

    // If flyto is passed down, jump the map to that location
    if (model.flyTo && this.isLoaded) {
      this.isRotating = false;
      this.mapObjects.flyToLocation(this.map, this.flyTo.coords, { zoom: 15, speed: 3 });
    }
  }

  ngAfterViewInit() {
    this.scriptsLoad();
  }

  /**
   * Check if map js is loaded, if not, load it then initialize the map in this component
   */
  public scriptsLoad() {
    if ((<any>window).mapboxgl) {
      this.mapInit(); // Mapbox already loaded, init map
      this.isLoaded = true;
    } else {
      // Dynamically load mapbox js
      const script = document.createElement('script');
      script.type = 'text/javascript';
      // Callback query param will fire after mapbox maps successfully loads
      script.src = scriptSrc;
      script.onload = () => {
        this.mapInit();
      }; // After load, init chart
      document.head.appendChild(script);
    }
  }

  /**
   * Create the map and set intial view and properties
   */
  private mapInit() {
    if (!this.map && document.getElementById(this.uniqueId)) {
      (<any>window).mapboxgl.accessToken = this.apiKey;
      // Get user's lat long to set initial position
      navigator.geolocation.getCurrentPosition(
        val => {
          // Confirm that lat and long were passed
          this.mapCreate([val.coords.longitude, val.coords.latitude]);
        },
        error => {
          console.log(error);
          this.mapCreate([-115.172813, 36.114647]);
        },
      );
    }
  }

  /**
   * Create the map after getting user coords
   * @param coords
   */
  private mapCreate(coords: [number, number]) {
    // Create new map
    this.map = new (<any>window).mapboxgl.Map({
      container: this.uniqueId,
      style: `mapbox://styles/mapbox/${this.style}-v9`, // basic-v9
      zoom: this.zoom,
      center: [-115.156665, 36.1383415], // 36.1383415,"display_lng":-115.156665
      // center: coords,
      // For rotation
      pitch: 60,
      // center: [-114.9775958, 36.0080202],
    });

    // When a use clicks on the map the first time only
    // Stop the rotation and fit bounds
    const resetMap = () => {
      this.isRotating = false;
      setTimeout(() => {
        this.mapObjects.mapFitBounds(this.map, this.markers);
      }, 100);
    };
    this.map.once('click', resetMap);

    // When the map finishes loading
    this.map.on('load', () => {
      // Start rotation
      this.rotateTo(0);
      // If heatmap is true and locations are supplied
      if (this.heatmap && this.locations) {
        this.mapObjects.heatMapAdd(this.map, this.locations);
      }

      // If heatmap not specified, add locations
      if (!this.heatmap) {
        this.locationsAdd(false);
      }

      // If no locations supplied on map create, plot the user's current location
      if (!this.locations) {
        // Create location
        const myLocation: Map.Location = {
          latitude: coords[1],
          longitude: coords[0],
        };
        this.locations = [myLocation];
        this.locationsAdd(false);
      }

      /**
      // Add 3d buildings and remove label layers to enhance the map
      const layers = this.map.getStyle().layers;
      for (let i = 0; i < layers.length; i++) {
        if (layers[i].type === 'symbol' && (<any>layers)[i].layout['text-field']) {
          // remove text labels
          this.map.removeLayer(layers[i].id);
        }
      }
      */

      // Add 3D layer
      this.map.addLayer({
        id: '3d-buildings',
        source: 'composite',
        'source-layer': 'building',
        filter: ['==', 'extrude', 'true'],
        type: 'fill-extrusion',
        // minzoom: 15,
        paint: {
          'fill-extrusion-color': '#aaa',
          // use an 'interpolate' expression to add a smooth transition effect to the
          // buildings as the user zooms in
          'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 15, 0, 15.05, ['get', 'height']],
          'fill-extrusion-base': ['interpolate', ['linear'], ['zoom'], 15, 0, 15.05, ['get', 'min_height']],
          'fill-extrusion-opacity': 0.6,
        },
      });
      // End 3d layer

      // Mark as loaded
      this.isLoaded = true;
    });
  }

  /**
   * Add the heatmap
   */
  private heatMapAdd() {
    // Remove any markers/locations on the map
    this.locationsRemove();
    // Remove any preexisting heatmap
    this.heatMapRemove();
    // Add existing heatmap
    this.mapObjects.heatMapAdd(this.map, this.locations);
    // Create map makers but do NOT add them to the map
    this.markers = this.mapObjects.markersCreate(this.locations);
    // Pass map markers to fit bounds to recenter the map on the heatmap
    this.mapObjects.mapFitBounds(this.map, this.markers);
  }

  /**
   * Remove existing heatmap
   */
  private heatMapRemove() {
    this.mapObjects.heatMapRemove(this.map);
  }

  /**
   * Add locations to the map
   */
  private locationsAdd(fitBounds = true) {
    // If locations passed, add markers
    if (this.locations && this.locations.length) {
      // Remove any existing markers
      this.locationsRemove();
      // Create markers
      this.markers = this.mapObjects.markersCreate(this.locations);
      // Add click event for markers, emits up via pinClicked
      this.markers.forEach(marker => {
        marker.getElement().addEventListener('click', (e: MouseEvent) => {
          this.isRotating = false;
          // this.mapObjects.mapFitBounds(this.map, this.markers);
          this.pinClicked.emit(marker.location);
          e.stopPropagation();
        });
      });

      // Add markers to map
      this.mapObjects.markersAdd(this.map, this.markers);
      if (fitBounds) {
        // Recenter and zoom map to fit markers
        this.mapObjects.mapFitBounds(this.map, this.markers);
      }
    } else {
      this.locationsRemove();
    }
  }

  /** Remove all created markers */
  private locationsRemove() {
    if (this.markers && this.markers.length) {
      this.markers.forEach(marker => marker.remove());
    }
  }

  /**
   * Slowly rotate the map
   * https://www.mapbox.com/mapbox-gl-js/example/animate-camera-around-point/
   */
  private rotateTo = (timestamp: number) => {
    // clamp the rotation between 0 -360 degrees
    // Divide timestamp by 100 to slow rotation to ~10 degrees / sec
    this.map.rotateTo((timestamp / 300) % 360, { duration: 0 });
    if (this.isRotating) {
      // Request the next frame of the animation.
      requestAnimationFrame(this.rotateTo);
    }
  }
}
