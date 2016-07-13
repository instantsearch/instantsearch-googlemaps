/* global google */

import React from 'react';
import ReactDOM from 'react-dom';
import GoogleMaps from './src/GoogleMaps.js';
import instantsearch from 'instantsearch.js';

/**
 * algolia/instantsearch.js widget to display your Algolia geo hits on a map using Google Maps APIs
 * @param  {DOMElement} options.container Where to insert the map in the document. This is required.
 * @param  {function} [options.prepareMarkerData] Function Called for every hit,
 * this is the moment where you can select the label and title
 * for the marker. This function should return an object in the form of `{label, title}`.
 *
 * Example:
 *
 * ```js
 * function prepareMarkerData(hit, index, hits) {
 *   return {
 *     label: hit.name,
 *     title: hit.description
 *   }
 * }
 * ```
 *
 * The `label` first letter will be displayed on the marker on the map.
 *
 * The `title` will be displayed when hovering the marker.
 *
 * By default we use the current hit index in the results as the label and the hit `ObjectID` for the title.
 * when hovering the marker
 * @param {boolean} [options.refineOnMapInteraction=false] Should we refine the search
 * on map interaction, default to false
 * @return {Object}
 */
function googleMaps({
  container,
  refineOnMapInteraction = false,
  prepareMarkerData = (hit, index) => ({
    label: `${index}`,
    title: hit.objectID
  })
}) {
  let widget = {
    _refine({helper}, userRefine) {
      let p1 = userRefine.bounds.getNorthEast();
      let p2 = userRefine.bounds.getSouthWest();
      let box = [p1.lat(), p1.lng(), p2.lat(), p2.lng()];
      this._lastUserRefine = userRefine;

      helper
        .setQueryParameter('insideBoundingBox', box.join(','))
        .search()
        .setQueryParameter('insideBoundingBox', undefined);
    },

    render({results, helper}) {
      let zoom;
      let center;

      let markers = results.hits
        .filter(hit => hit._geoloc !== undefined)
        .map((hit, index) =>
          ({
            position: new google.maps.LatLng(hit._geoloc),
            id: hit.objectID,
            ...prepareMarkerData(hit, index, results.hits)
          })
        );

      if (markers.length === 0) {
        zoom = 1;
        center = new google.maps.LatLng({
          lat: 48.797885,
          lng: 2.337034
        });
      } else if (this._lastUserRefine) {
        zoom = this._lastUserRefine.zoom;
        center = this._lastUserRefine.center;
        this._lastUserRefine = false;
      } else {
        let bounds = new google.maps.LatLngBounds();
        markers.forEach(marker => bounds.extend(marker.position));
        zoom = this._getBestZoomLevel(bounds, container.getBoundingClientRect());
        center = bounds.getCenter();
      }

      ReactDOM.render(
        <GoogleMaps
          center={center}
          markers={markers}
          refine={this._refine.bind(this, {helper})}
          refineOnMapInteraction={refineOnMapInteraction}
          zoom={zoom}
        />, container
      );
    },

    // http://stackoverflow.com/a/13274361/147079
    // We cannot use map.fitBounds because we are in a React world
    // where you should not (and it does not works) try to modify
    // the rendering once rendered
    // You need to recompute the right props
    // It's actually a lot easier than the previous implementation
    // that was using a LOT of state
    _getBestZoomLevel(bounds, mapDim) {
      const WORLD_DIM = {height: 256, width: 256};
      const ZOOM_MAX = 21;

      function latRad(lat) {
        var sin = Math.sin(lat * Math.PI / 180);
        var radX2 = Math.log((1 + sin) / (1 - sin)) / 2;
        return Math.max(Math.min(radX2, Math.PI), -Math.PI) / 2;
      }

      function zoom(mapPx, worldPx, fraction) {
        return Math.floor(Math.log(mapPx / worldPx / fraction) / Math.LN2);
      }

      var ne = bounds.getNorthEast();
      var sw = bounds.getSouthWest();

      var latFraction = (latRad(ne.lat()) - latRad(sw.lat())) / Math.PI;

      var lngDiff = ne.lng() - sw.lng();
      var lngFraction = ((lngDiff < 0) ? (lngDiff + 360) : lngDiff) / 360;

      var latZoom = zoom(mapDim.height, WORLD_DIM.height, latFraction);
      var lngZoom = zoom(mapDim.width, WORLD_DIM.width, lngFraction);

      return Math.min(latZoom, lngZoom, ZOOM_MAX);
    }
  };

  return widget;
}

instantsearch.widgets.googleMaps = googleMaps;

export default googleMaps;
