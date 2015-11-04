/* global google */

import React from 'react';
import {GoogleMap, Marker} from 'react-google-maps';

export default class GoogleMaps extends React.Component {
  componentWillUpdate(nextProps) {
    let bounds = new google.maps.LatLngBounds();
    nextProps.markers.forEach(({position}) => bounds.extend(position));
    google.maps.event.addListenerOnce(this._map, 'bounds_changed', function() {
      this._map.setZoom(this._map.getZoom() - 1);

      if (this.getZoom() > 15) {
        this.setZoom(15);
      }
    });
    this._map.fitBounds(bounds);
  }

  render() {
    return (
      <GoogleMap containerProps={{style: {height: '100%'}}}
        defaultCenter={this.props.defaultCenter}
        defaultZoom={this.props.defaultZoom}
        ref={map => this._map = map}
      >
        {this.props.markers.map(marker => <Marker key={marker.id} {...marker} />)}
      </GoogleMap>
    );
  }
}
