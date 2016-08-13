import React, { Component } from 'react';


const propTypes = {
};

function createMap(element) {
  return new google.maps.Map(element, {
    scrollwheel: true,
    zoom: 17,
    disableDefaultUI: true,
  });
}

function createSearchBox(element) {
  return new google.maps.places.SearchBox(element);
}

class User {
  constructor(map) {
    this._map = map;
    this._position = {
      lat: 0,
      lng: 0,
    };
    this._circle = new google.maps.Circle({
      strokeColor: '#aaa',
      strokeOpacity: 0.3,
      strokeWeight: 1,
      fillColor: '#aaa',
      fillOpacity: 0.3,
      map: this._map,
      center: this._position,
      radius: 30,
    });
    this._center = new google.maps.Circle({
      strokeColor: '#00BCD4',
      strokeOpacity: 0.8,
      strokeWeight: 1,
      fillColor: '#00BCD4',
      fillOpacity: 1,
      map: this._map,
      center: this._position,
      radius: 5,
    });
  }
  setPosition(position) {
    this._circle.setCenter(position);
    this._center.setCenter(position);
  }
}

export default class BucketPage extends Component {
  componentDidMount() {
    this._map = createMap(this.refs.map);
    this._searchBox = createSearchBox(this.refs.searchbox);
    this._user = new User(this._map);
    this._markers = [];

    navigator.geolocation.getCurrentPosition((position) => {
      const pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      this._user.setPosition(pos);
      this._map.setCenter(pos);
    });

    this._map.addListener('bounds_changed', () => {
      this._searchBox.setBounds(this._map.getBounds());
    });

    this._searchBox.addListener('places_changed', () => {
      const places = this._searchBox.getPlaces();

      // clear markers
      this._markers.forEach((marker) => {
        this._marker.setMap(null);
      });
      this._markers = [];

      const bounds = new google.maps.LatLngBounds();
      places.forEach((place) => {
        const icon = {
          url: place.icon,
          size: new google.maps.Size(71, 71),
          origin: new google.maps.Point(0, 0),
          anchor: new google.maps.Point(17, 34),
          scaledSize: new google.maps.Size(25, 25)
        };

        // Create a marker for each place.
        this._markers.push(new google.maps.Marker({
          map: this._map,
          icon: icon,
          title: place.name,
          position: place.geometry.location
        }));

        if (place.geometry.viewport) {
          bounds.union(place.geometry.viewport);
        } else {
          bounds.extend(place.geometry.location);
        }
      });
      this._map.fitBounds(bounds);
    });
  }
  render() {
    return (
      <section className="page bucket-page">
        <section className="page-content">
          <input className="bucket-search-box" type="text" ref="searchbox" />
          <section className="bucket-map" ref="map" />
        </section>
      </section>
    );
  }
}
BucketPage.propsTypes = propTypes;

