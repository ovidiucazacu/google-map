import { Component, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';

interface MarkerProperties {
  position: {
    lat: number;
    lng: number;
  },
  label: string
};

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('myGoogleMap', { static: true }) map!: GoogleMap;
  
  title = 'google-map';

  mapOptions: google.maps.MapOptions = {
    center: { lat: 27.697922, lng: 3.0477108 },
    mapTypeId: 'hybrid',
    zoomControl: false,
    scrollwheel: false,
    disableDoubleClickZoom: true,
    zoom: 3
  };

  markers: MarkerProperties[] = [
    { position: { lat: 28.6590614, lng: 77.0596363 }, label: 'A'},
    { position: { lat: 51.3418814, lng: 12.2288302 }, label: 'B'},
    { position: { lat: 40.4380986, lng: -3.8443434 }, label: 'C'}
  ];

  handleMapInitialized(map: google.maps.Map) {
    let markerIndex = 0;

    setInterval(() => {
      let bounds = new google.maps.LatLngBounds();
      ++markerIndex;
      if(markerIndex >= this.markers.length){
        markerIndex = 0;
      }
      bounds.extend(this.markers[markerIndex].position);
  
      setTimeout(() => {
        map.fitBounds(bounds),
        
        setTimeout(() => {
          this.markers.forEach((marker: MarkerProperties )=> {
            new google.maps.Marker({
              position: marker.position,
              map,
              label: marker.label
            });
            smoothZoom(map, 22, 7);
            bounds.extend(marker.position);
            //this.map.panTo(marker.position)
          });
          //smoothZoom(gmap, 15, 8)
          //this.map.fitBounds(bounds)
        }, 1000);
  
      }, 3000);
      
    }, 5000);
  }
}

function smoothZoom(map: google.maps.Map, targetZoom: number, currentZoom: number){
  console.log(currentZoom, targetZoom)
  if (currentZoom >= targetZoom){
    return;
  } else {
    let mz = google.maps.event.addListener(map, 'zoom_changed', function(){
      google.maps.event.removeListener(mz);
      smoothZoom(map, targetZoom, currentZoom + 1)
    });
    setTimeout(() => map.setZoom(currentZoom), 80)
  }
}