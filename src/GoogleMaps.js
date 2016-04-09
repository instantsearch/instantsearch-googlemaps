/* global google */

import React from 'react';
import {GoogleMapLoader, GoogleMap, Marker, InfoWindow} from 'react-google-maps';
import MarkerClusterer from 'react-google-maps/lib/addons/MarkerClusterer';

class GoogleMaps extends React.Component {

  constructor() {
    super();
    this.state = { 
      markerID: null
    }
  }

  shouldComponentUpdate(nextProps,nextState) {
    return nextProps.zoom !== this.props.zoom || // user has changed zoom
      nextState.markerID !== this.state.markerID || // user has clicked on marker
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

  _handleMarkerClick(marker) {
    this.props.refine({
      bounds: this._map.getBounds(),
      center: this._map.getCenter(),
      zoom: this._map.getZoom()
    });
    this.setState({ markerID: marker.id });
  }

  _handleMarkerClose() {
    this.setState({ markerID: null });
  }

  _renderInfoWindow(ref, marker) {
    return (
      <InfoWindow 
        key={`${ref}_info_window`}
        onCloseclick={this._handleMarkerClose.bind(this)}
      >
        <div>
          <h2>{ marker.title }</h2>
          <p>{ marker.label }</p>
        </div>
      </InfoWindow>
    )
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
              {this.props.markers.map((marker,index) => {
                const ref = `marker_${index}`;
                return (
                  <Marker {...marker}
                    key={index} 
                    ref={ref}
                    onClick={ this._handleMarkerClick.bind(this, marker) }
                  >
                    { this.state.markerID === marker.id ? this._renderInfoWindow(ref, marker) : null }
                  </Marker>
                )
              })}
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
