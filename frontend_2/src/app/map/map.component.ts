import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import * as L from 'leaflet';

// L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() mapType = 'default';
  @Input() manyTags = true;
  @Input() readOnly = false;
  @Input() latitude = 51.075481599999996;
  @Input() longitude = 16.9934848;
  @Input() name = 'Burzowa 3, 53-028 Vratislavie, Pologne';
  @Input() markers: Marker[] = [];
  @Output() markerChange: EventEmitter<Marker> = new EventEmitter<Marker>();

  private map: L.Map;

  greenMarker: L.Icon;
  redIcon: L.Icon;

  ngOnInit() {
  }


  ngAfterViewInit(): void {
    this.initMap();
    this.markers.forEach(m => this.addMarker(m));
  }

  ngOnDestroy() {
    delete this.map;
  }

  initMap(): void {
    this.map = L.map('map' + this.mapType, {
      center: [this.latitude, this.longitude],
      zoom: 10
    });
    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 14,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',

    });

    tiles.addTo(this.map);
    this.map.on('click', this.onMapClick);
  }

  onMapClick = (e) => {
    if (!this.readOnly) {
      if (!this.manyTags) {
        this.markers = [];
        this.map.eachLayer(l => l.getAttribution() ? null : l.remove());
      }
      this.markerChange.emit({ latitude: e.latlng.lat, longitude: e.latlng.lng, name: e.name });
      this.addMarker({ latitude: e.latlng.lat, longitude: e.latlng.lng, name: e.name });
      this.markers.push({ latitude: e.latlng.lat, longitude: e.latlng.lng, name: e.name });
    }
  }

  addMarker(marker: Marker) {
    let color = marker.isWrongPosition ? 'red': 'green';
    if (marker.isWrongPosition === undefined) {
      color = 'default';
    }
    this.map.addLayer(L.marker({ lng: marker.longitude, lat: marker.latitude }, {icon: this.getColorMarker(color)}).addTo(this.map));
  }

  private getColorMarker(color?: string): L.Icon {
    switch (color) {
      case 'green':
        return new L.Icon({
          // iconRetinaUrl: 'assets/marker-icon-2x.png',
          shadowUrl: 'assets/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          tooltipAnchor: [16, -28],
          shadowSize: [41, 41],
          iconUrl: 'assets/ok-marker.png',
        });
      case 'red':
        return new L.Icon({
          shadowUrl: 'assets/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          tooltipAnchor: [16, -28],
          shadowSize: [41, 41],
          iconUrl: 'assets/bad-marker.png'
        });
        default:
          return new L.Icon({
            shadowUrl: 'assets/marker-shadow.png',
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            tooltipAnchor: [16, -28],
            shadowSize: [41, 41],
            iconUrl: 'assets/marker-icon.png'
          });
    }
  }
}

interface Marker {
  name: string;
  latitude: number;
  longitude: number;
  isWrongPosition?: boolean;
}
