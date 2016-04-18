/* global google */

import React from 'react';
import ReactDOM from 'react-dom';
import GoogleMaps from './src/GoogleMaps.js';
import instantsearch from 'instantsearch.js';

/**
 * algolia/instantsearch.js widget to display your Algolia geo hits on a map using Google Maps APIs
 * @param  {DOMElement} options.container Where to insert the map in the document. This is required.
 * @param  {function} [options.prepareMarkerOptions] Function Called for every hit,
 * this is the moment where you can select the label and title
 * for the marker. This function should return an object in the form of `{label, title}`.
 *
 * Example:
 *
 * ```js
 * function prepareMarkerOptions(hit, index, hits) {
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
  // https://developers.google.com/maps/documentation/javascript/3.exp/reference#MarkerOptions
  computeMarkerOptions = ({hit, index, isActive}) => ({
    label: `${index}`, // show the marker number as first letter
    title: hit.objectID // show a tooltip with the objectID by default when hovering
  })
}) {
  let widget = {
    init({helper}) {
      this._handleUserAction = this._handleUserAction.bind(this, helper);
      this._handleMarkerOpen = this._handleMarkerOpen.bind(this);
      this._handleMarkerClose = this._handleMarkerClose.bind(this);
    },

    _handleUserAction(helper, {bounds, center, zoom}) {
      this._userZoomCenter = {center, zoom};

      if (!refineOnMapInteraction) {
        this._lastZoomCenter = {center, zoom};
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

    _handleMarkerOpen({marker, index}) {
      this._setActiveMarker(marker.id, index);
    },

    _handleMarkerClose({marker, index}) {
      this._setActiveMarker(null, index);
    },

    _setActiveMarker(id, index) {
      this.render({
        results: this._results,
        activeMarkerId: id,
        activeMarkerIndex: index,
        zoomCenter: this._lastZoomCenter
      });
    },

    render({results, activeMarkerId, activeMarkerIndex, zoomCenter}) {
      let zoom;
      let center;

      this._results = results;

      let markers = results.hits.map((hit, index) => ({
        id: hit.objectID,
        markerData: {
          // this is the options passed to a GoogleMaps Marker
          // https://developers.google.com/maps/documentation/javascript/3.exp/reference#MarkerOptions
          position: new google.maps.LatLng(hit._geoloc),
          ...computeMarkerOptions({hit, index, hits: results.hits, isActive: activeMarkerIndex === index})
        },
        hit
      }));

      if (markers.length === 0) {
        zoom = 1;
        center = new google.maps.LatLng({
          lat: 48.797885,
          lng: 2.337034
        });
      } else if (zoomCenter) {
        zoom = zoomCenter.zoom;
        center = zoomCenter.center;
      } else if (this._userZoomCenter) {
        zoom = this._userZoomCenter.zoom;
        center = this._userZoomCenter.center;
        this._userZoomCenter = false;
      } else {
        let bounds = new google.maps.LatLngBounds();
        markers.forEach(marker => bounds.extend(marker.markerData.position));
        zoom = this._getBestZoomLevel(bounds, container.getBoundingClientRect());
        center = bounds.getCenter();
      }

      this._lastZoomCenter = {center, zoom};

      ReactDOM.render(
        <GoogleMaps
          activeMarkerId={activeMarkerId}
          googleMapOptions={{center, zoom}}
          markers={markers}
          onMarkerClose={this._handleMarkerClose}
          onMarkerOpen={this._handleMarkerOpen}
          onUserAction={this._handleUserAction}
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
