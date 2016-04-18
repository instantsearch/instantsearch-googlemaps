/* global google */

import React from 'react';
import {GoogleMapLoader, GoogleMap, Marker, InfoWindow} from 'react-google-maps';
import MarkerClusterer from 'react-google-maps/lib/addons/MarkerClusterer';

class GoogleMaps extends React.Component {
  constructor(props) {
    super(props);
    this._handleUserAction = this._handleUserAction.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    return nextProps.zoom !== this.props.zoom || // user has changed zoom
      nextProps.activeMarkerId !== this.props.activeMarkerId || // user has clicked on marker
      nextProps.markers.length !== this.props.markers.length || // different results number
      nextProps.markers.some((marker, markerIndex) => // same number of results, but different markers?
        this.props.markers[markerIndex] === undefined ||
        marker.id !== this.props.markers[markerIndex].id);
  }

  _handleUserAction() {
    this.props.onUserAction({
      bounds: this._map.getBounds(),
      center: this._map.getCenter(),
      zoom: this._map.getZoom()
    });
  }

  _renderInfoWindow({marker, handleOnCloseClick}) {
    return (
      <InfoWindow
        onCloseclick={handleOnCloseClick}
      >
        <div>
          <h2>{marker.markerData.title}</h2>
          <p>{marker.markerData.label}</p>
        </div>
      </InfoWindow>
    )
  }

  render() {
    console.log('render')

    return (
      <GoogleMapLoader
        containerElement={<div style={{height: '100%'}}/>}
        googleMapElement={
          <GoogleMap
            onDragend={this._handleUserAction}
            onZoomChanged={this._handleUserAction}
            ref={map => this._map = map}
            // https://developers.google.com/maps/documentation/javascript/3.exp/reference#MapOptions
            {...this.props.googleMapOptions}
          >
            {this.props.markers.map((marker, index) => {
              return (
                <Marker
                  key={marker.id}
                  onClick={() => this.props.onMarkerOpen({
                    marker,
                    index
                  })}
                  {...marker.markerData}
                >
                  {this.props.activeMarkerId === marker.id ?
                    this._renderInfoWindow({
                      marker,
                      handleOnCloseClick: () => this.props.onMarkerClose({
                        marker,
                        index
                      })
                    }) :
                    null
                  }
                </Marker>
              )
            })}
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
  refineOnMapInteraction: React.PropTypes.bool,
  zoom: React.PropTypes.number
};

export default GoogleMaps;
