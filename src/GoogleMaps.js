/* global google */

import React from 'react';
import {GoogleMapLoader, GoogleMap, Marker} from 'react-google-maps';
import MarkerClusterer from 'react-google-maps/lib/addons/MarkerClusterer';
import debounce from 'lodash/function/debounce';

class GoogleMaps extends React.Component {
  constructor(props) {
    super(props);
    this._userRefine = debounce(this._userRefine, 200);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.zoom !== this.props.zoom || // user has changed zoom
      nextProps.markers.length !== this.props.markers.length || // different results number
      nextProps.markers.some((marker, markerIndex) => // same number of results, but different markers?
        this.props.markers[markerIndex] === undefined ||
        marker.id !== this.props.markers[markerIndex].id);
  }

  _shouldRefineOnMapInteraction(fn) {
    if (this.props.refineOnMapInteraction === true) {
      return fn;
    }

    return function noop() {};
  }

  _userRefine() {
    if (this.props.refineOnMapInteraction) {
      this.props.refine({
        bounds: this._map.getBounds(),
        center: this._map.getCenter(),
        zoom: this._map.getZoom()
      });
    }
  }

  render() {
    return (
      <GoogleMapLoader
        containerElement={<div style={{height: '100%'}}/>}
        googleMapElement={
          <GoogleMap
            onDragend={this._userRefine.bind(this)}
            onZoomChanged={this._userRefine.bind(this)}
            ref={map => this._map = map}
            {...this.props}
          >
            <MarkerClusterer
              averageCenter
              enableRetinaIcons
              gridSize={30}
            >
              {this.props.markers.map(marker => <Marker key={marker.id} {...marker} />)}
            </MarkerClusterer>
          </GoogleMap>
        }
      />
    );
  }
}

GoogleMaps.propTypes = {
  center: React.PropTypes.object, // google.maps.LatLng,
  markers: React.PropTypes.arrayOf(React.PropTypes.shape({
    id: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
    label: React.PropTypes.string,
    position: React.PropTypes.object, // google.maps.LatLng
    title: React.PropTypes.string
  })).isRequired,
  refine: React.PropTypes.func.isRequired,
  refineOnMapInteraction: React.PropTypes.bool,
  zoom: React.PropTypes.number
};

export default GoogleMaps;
