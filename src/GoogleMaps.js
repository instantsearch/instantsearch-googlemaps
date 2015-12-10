/* global google */

import React from 'react';
import {GoogleMapLoader, GoogleMap, Marker} from 'react-google-maps';
import MarkerClusterer from 'react-google-maps/lib/addons/MarkerClusterer';
import debounce from 'lodash/function/debounce';

class GoogleMaps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {userAction: true, userRefine: false, ignoreUpdate: false};
    this._handleZoomChanged = debounce(
      this._shouldRefineOnMapInteraction(
        this._handleZoomChanged
      ), 200
    );
    this._handleDragEnd = debounce(
      this._shouldRefineOnMapInteraction(
        this._handleDragEnd
      ), 200
    );
  }

  componentDidMount() {
    let debouncedFitMapToMarkers = debounce(this._fitMapToMarkers.bind(this), 200);
    debouncedFitMapToMarkers();
    window.addEventListener('resize', debouncedFitMapToMarkers);
    window.addEventListener('load', debouncedFitMapToMarkers);
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.ignoreUpdate === true) {
      this.setState({ignoreUpdate: false});
      return;
    }

    if (this.state.userRefine === true) {
      this.setState({userRefine: false});
      return;
    }

    this._fitMapToMarkers(nextProps.markers);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.ignoreUpdate === false &&
      nextProps.markers.some((marker, markerIndex) =>
        this.props.markers[markerIndex] === undefined ||
        marker.id !== this.props.markers[markerIndex].id);
  }

  _shouldRefineOnMapInteraction(fn) {
    if (this.props.refineOnMapInteraction === true) {
      return fn;
    }

    return function noop() {};
  }

  _handleDragEnd() {
    this.setState({userRefine: true});
    this.props.refine(this._map.getBounds());
  }

  _handleZoomChanged() {
    if (this.state.userAction === false) {
      this.setState({userAction: true});
      return;
    }

    // there's a previous userRefine, ignore it on next componentWillReceiveProps
    if (this.state.userRefine === true) {
      this.setState({ignoreUpdate: true});
    } else {
      this.setState({userRefine: true});
    }

    this.props.refine(this._map.getBounds());
  }

  _fitMapToMarkers(markers) {
    if (!markers) {
      markers = this.props.markers;
    }

    let bounds = new google.maps.LatLngBounds();
    markers.forEach(({position}) => bounds.extend(position));

    this.setState({userAction: false}, function() {
      this._map.fitBounds(bounds);
    });
  }

  render() {
    return (
      <GoogleMapLoader
        containerElement={<div style={{height: '100%'}}/>}
        googleMapElement={
          <GoogleMap
            onDragend={this._handleDragEnd.bind(this)}
            onZoomChanged={this._handleZoomChanged.bind(this)}
            ref={map => this._map = map}
          >
            <MarkerClusterer
              averageCenter
              enableRetinaIcons
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
  markers: React.PropTypes.arrayOf(React.PropTypes.shape({
    id: React.PropTypes.oneOfType([React.PropTypes.number, React.PropTypes.string]),
    label: React.PropTypes.string,
    position: React.PropTypes.object,
    title: React.PropTypes.string
  })).isRequired,
  refine: React.PropTypes.func.isRequired,
  refineOnMapInteraction: React.PropTypes.bool
};

export default GoogleMaps;
