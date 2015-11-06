/* global google */

import React from 'react';
import {GoogleMap, Marker} from 'react-google-maps';
import debounce from 'lodash/function/debounce';

class GoogleMaps extends React.Component {
  constructor(props) {
    super(props);
    this.state = {userAction: true, userRefine: false, ignoreUpdate: false};
    this._handleZoomChanged = debounce(this._handleZoomChanged, 200);
    this._handleDragEnd = debounce(this._handleDragEnd, 200);
  }

  componentDidMount() {
    // without setTimeout, the GoogleMap component will try to access state.map
    // which fail at componentDidMount
    setTimeout(this._fitMapToMarkers.bind(this, this.props), 0);
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

    this._fitMapToMarkers(nextProps);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.ignoreUpdate === false &&
      nextProps.markers.some((marker, markerIndex) =>
        this.props.markers[markerIndex] === undefined ||
        marker.id !== this.props.markers[markerIndex].id);
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

  _fitMapToMarkers(props) {
    let bounds = new google.maps.LatLngBounds();
    props.markers.forEach(({position}) => bounds.extend(position));

    this.setState({userAction: false}, function() {
      this._map.fitBounds(bounds);
    });
  }

  render() {
    return (
      <GoogleMap
        containerProps={{style: {height: '100%'}}}
        onDragend={this._handleDragEnd.bind(this)}
        onZoomChanged={this._handleZoomChanged.bind(this)}
        ref={map => this._map = map}
      >
        {this.props.markers.map(marker => <Marker key={marker.id} {...marker} />)}
      </GoogleMap>
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
  refine: React.PropTypes.func.isRequired
};

export default GoogleMaps;
