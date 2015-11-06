/* global google */

import React from 'react';
import ReactDOM from 'react-dom';
import GoogleMaps from './src/GoogleMaps.js';
import debounce from 'lodash/function/debounce';

/**
 * algolia/instantsearch.js widget to display your Algolia geo hits on a map using Google Maps APIs
 * @param  {DOMElement} options.container CSS Selector or DOMElement to insert the widget
 * @param  {function} options.prepareMakerData Function to call to prepare marker data, should return an object
 * in the form of {label, title}. First letter of label will be used on the marker, title is used
 * when hovering the marker
 * @return {Object}
 */
function googleMaps({
  container,
  prepareMakerData
}) {
  let widget = {
    _refine({helper}, bounds) {
      if (!bounds) {
        return;
      }

      let p1 = bounds.getNorthEast();
      let p2 = bounds.getSouthWest();
      let box = [p1.lat(), p1.lng(), p2.lat(), p2.lng()];

      helper
        .setQueryParameter('insideBoundingBox', box.join(','))
        .search()
        .setQueryParameter('insideBoundingBox', undefined);
    },

    render({results, helper}) {
      let markers = results.hits.map(hit => ({
        position: new google.maps.LatLng(hit._geoloc),
        id: hit.objectID,
        ...prepareMakerData(hit)
      }));

      ReactDOM.render(
        <GoogleMaps
          markers={markers}
          refine={this._refine.bind(this, {helper})}
        />, container
      );
    }
  };

  // no need to do too much map rendering, it can take a lot of time
  // to display a map with all the tiles and a constantly mooving map is
  // not UX friendly
  widget.render = debounce(widget.render, 200, {leading: true});

  return widget;
}

export default googleMaps;
