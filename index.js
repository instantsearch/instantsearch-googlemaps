/* global google */

import React from 'react';
import ReactDOM from 'react-dom';
import GoogleMaps from './src/GoogleMaps.js';

function googleMaps({
  container,
  defaultZoom,
  defaultCenter
}) {
  return {
    render({results}) {
      let markers = results.hits.map(({
        _geoloc: {lat, lng},
        airport_id: label,
        name: title,
        objectID: id
      }) => ({
        position: new google.maps.LatLng({lat, lng}),
        label,
        title,
        id
      }));

      ReactDOM.render(
        <GoogleMaps
          defaultCenter={defaultCenter}
          defaultZoom={defaultZoom}
          markers={markers}
        />, container
      );
    }
  };
}

export default googleMaps;
