import React, { Component } from 'react';


const propTypes = {
};

class Map {
  constructor(mapElement, inputElement, listElement) {
    this._mapElement = mapElement;
    this._inputElement = inputElement;
    this._listElement = listElement;

    this._map = new google.maps.Map(this._mapElement, {
      scrollwheel: true,
      zoom: 17,
      disableDefaultUI: true,
    });
    this._user = new User(this._map);
    // this._infowindow = new google.maps.InfoWindow({
    //   content: '<h1>Add bucket list</h1>'
    // });
    this._markers = [];

    this._placesServie = new google.maps.places.PlacesService(this._map);

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
      const keyword = event.target.value;
      const pos = this._user.getPosition();

      if (keyword) {
        this._placesServie.textSearch({
          location: new google.maps.LatLng(pos.lat, pos.lng),
          radius: 800,
          query: event.target.value,
        }, (places, status) => {
          if (places && places.length) {
            if (keyCode === 13) {
              this._inputElement.blur();
              this._renderList([]);
              this._clearMarker();
              this._showPlaces(places, true);
            } else {
              this._renderList(places);
              this._clearMarker();
              this._showPlaces(places);
            }
          }
        });
      } else {
        this._renderList([]);
      }
    });
  }
  _renderList(places) {
    const candidateHTML = places.map((place) => {
      return `<li>${ place.name }</li>`;
    }).join('');
    this._listElement.innerHTML = candidateHTML;
  }
  _showPlaces(places, isBounds) {
    const bounds = new google.maps.LatLngBounds();
    places.forEach((place) => {
      // const icon = {
      //   url: place.icon,
      //   size: new google.maps.Size(71, 71),
      //   origin: new google.maps.Point(0, 0),
      //   anchor: new google.maps.Point(17, 34),
      //   scaledSize: new google.maps.Size(25, 25)
      // };

      const marker = new google.maps.Marker({
        map: this._map,
        position: place.geometry.location,
      })
      marker.addListener('click', () => {
        // this._infowindow.open(this._map, marker);
      });
      this._addMarker(marker);

      if (place.geometry.viewport) {
        bounds.union(place.geometry.viewport);
      } else {
        bounds.extend(place.geometry.location);
      }
    });
    if (isBounds) {
      this._map.fitBounds(bounds);
    }
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
    new Map(this.refs.map, this.refs.input, this.refs.list);
  }
  render() {
    return (
      <section className="page bucket-page">
        <section className="page-content">
          <section className="bucket-search-box">
            <input
              autoFocus
              className="bucket-search-box-input"
              type="text"
              ref="input"
              placeholder="Search"
            />
            <ul className="bucket-search-box-list" ref="list" />
          </section>
          <section className="bucket-map" ref="map" />
        </section>
      </section>
    );
  }
}
BucketPage.propsTypes = propTypes;

