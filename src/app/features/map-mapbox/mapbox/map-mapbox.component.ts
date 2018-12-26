import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  AfterViewInit,
  ViewEncapsulation,
  OnChanges,
} from '@angular/core';
import { Map } from 'mapbox-gl';
import { MapObjectsService } from '../services/map-objects.service';

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
  /** Bing API key which can be generated @ https://www.bingmapsportal.com/Application. Defaults to low usage dev key */
  @Input() apiKey = apiKey;

  @Input() zoom = 15.5;

  /** Has script loaded  */
  public isLoaded = false;
  /** Map reference */
  public map: Map;

  /** Randomly generated uniqueID for the div that holds the map. Allows for multiple map per page  */
  public uniqueId = 'map-box' + Math.floor(Math.random() * 1000000);

  constructor(private mapObjects: MapObjectsService) {}

  ngOnInit() {}

  ngOnChanges(model: any) {
    if (model.locations) {
      // this.map = null;
      // this.mapInit();
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
      this.mapInit(); // Bing already loaded, init map
      this.isLoaded = true;
    } else {
      // Dynamically load bing js
      const script = document.createElement('script');
      script.type = 'text/javascript';
      // Callback query param will fire after bing maps successfully loads
      script.src = scriptSrc;
      script.onload = () => {
        this.mapInit();
        this.isLoaded = true;
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
      navigator.geolocation.getCurrentPosition(val => {
        console.log(val);
        // Create new map
        this.map = new (<any>window).mapboxgl.Map({
          container: this.uniqueId,
          style: 'mapbox://styles/mapbox/dark-v9',
          zoom: this.zoom,
          center: [val.coords.longitude, val.coords.latitude],
          // For rotation
          // zoom: 15.5,
          pitch: 45
          // center: [-114.9775958, 36.0080202],
          
        });

        // If locations passed, add markers
        if (this.locations) {
          this.mapObjects.addMarkers(this.map, this.locations);
        }

        this.map.on('load', () => {

          this.rotateTo(0);

          /**
          this.map.flyTo({
            zoom: 15.5,
            pitch: 45,
            speed: 1.2,
            curve: 1.42,
            // maxDuration: 2000,
            easing(t) {
              return t;
            }
          });
          setTimeout(() => {
            // Start the animation.
            this.rotateTo(0);
          }, 2500);
           */

          // Add 3d buildings and remove label layers to enhance the map
          const layers = this.map.getStyle().layers;
          for (let i = 0; i < layers.length; i++) {
              if (layers[i].type === 'symbol' && (<any>layers)[i].layout['text-field']) {
                  // remove text labels
                  this.map.removeLayer(layers[i].id);
              }
          }


          this.map.addLayer({
            'id': '3d-buildings',
            'source': 'composite',
            'source-layer': 'building',
            'filter': ['==', 'extrude', 'true'],
            'type': 'fill-extrusion',
            'minzoom': 15,
            'paint': {
                'fill-extrusion-color': '#aaa',
    
                // use an 'interpolate' expression to add a smooth transition effect to the
                // buildings as the user zooms in
                'fill-extrusion-height': [
                    'interpolate', ['linear'], ['zoom'],
                    15, 0,
                    15.05, ['get', 'height']
                ],
                'fill-extrusion-base': [
                    'interpolate', ['linear'], ['zoom'],
                    15, 0,
                    15.05, ['get', 'min_height']
                ],
                'fill-extrusion-opacity': .6
            }
        });

        })

        

        /** Add geolocate conrol
        this.map.addControl(new (<any>window).mapboxgl.GeolocateControl({
            positionOptions: {
                enableHighAccuracy: true
            },
            trackUserLocation: true
        }));
        */
      });
    }
  }

  /**
   * Slowly rotate the map
   * https://www.mapbox.com/mapbox-gl-js/example/animate-camera-around-point/
   */
  private rotateTo = (timestamp: number) => {
  // clamp the rotation between 0 -360 degrees
    // Divide timestamp by 100 to slow rotation to ~10 degrees / sec
    this.map.rotateTo((timestamp / 300) % 360, {duration: 0});
    // Request the next frame of the animation.
    requestAnimationFrame(this.rotateTo);
  }

}
