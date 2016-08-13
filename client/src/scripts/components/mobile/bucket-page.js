import React, { Component } from 'react';


const propTypes = {
};

class Map {
  constructor(mapElement, inputElement) {
    this._mapElement = mapElement;
    this._inputElement = inputElement;

    this._map = new google.maps.Map(this._mapElement, {
      scrollwheel: true,
      zoom: 17,
      disableDefaultUI: true,
    });
    this._user = new User(this._map);
    this._markers = [];

    this._service = new google.maps.places.PlacesService(this._map);

    this._getCurrentPosition((position) => {
      const pos = {
        lat: position.coords.latitude,
        lng: position.coords.longitude,
      };
      this._user.setPosition(pos);
      this._user.showPosition();
      this._map.setCenter(pos);
    });
    this._setEventListeners();
  }
  _getCurrentPosition(callback) {
    navigator.geolocation.getCurrentPosition((position) => {
      callback(position);
    });
  }
  _setEventListeners() {
    this._inputElement.addEventListener('keydown', (event) => {
      const keyCode = event.keyCode;

      if (keyCode === 13) {
        const pos = this._user.getPosition();
        this._service.textSearch({
          query: event.target.value,
          location: new google.maps.LatLng(pos.lat, pos.lng),
          radius: 300,
        }, (places, status) => {
          if (places.length) {
            this._inputElement.blur();
            this._clearMarker();
            this._showPlaces(places);
          }
        });
      }
    });
  }
  _showPlaces(places) {
    const bounds = new google.maps.LatLngBounds();
    places.forEach((place) => {
      const icon = {
        url: place.icon,
        size: new google.maps.Size(71, 71),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(17, 34),
        scaledSize: new google.maps.Size(25, 25)
      };

      this._addMarker(new google.maps.Marker({
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
  }
  _addMarker(marker) {
    this._markers.push(marker);
  }
  _clearMarker() {
    this._markers.forEach((marker) => {
      marker.setMap(null);
    });
    this._markers = [];
  }
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
  getPosition() {
    return this._position;
  }
  setPosition(position) {
    this._position = position;
  }
  showPosition() {
    this._circle.setCenter(this._position);
    this._center.setCenter(this._position);
  }
}

export default class BucketPage extends Component {
  componentDidMount() {
    new Map(this.refs.map, this.refs.input);
  }
  render() {
    return (
      <section className="page bucket-page">
        <section className="page-content">
          <input autoFocus className="bucket-search-box" type="text" ref="input" />
          <section className="bucket-map" ref="map" />
        </section>
      </section>
    );
  }
}
BucketPage.propsTypes = propTypes;

