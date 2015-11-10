/* global google */

import React from 'react';
import ReactDOM from 'react-dom';
import GoogleMaps from './src/GoogleMaps.js';
import debounce from 'lodash/function/debounce';
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
 * @param {boolean} [options.refineOnMapInteraction=false] Should we refine the search on map interaction, default to false
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
      let markers = results.hits.map((hit, index) => ({
        position: new google.maps.LatLng(hit._geoloc),
        id: hit.objectID,
        ...prepareMarkerData(hit, index, results.hits)
      }));

      ReactDOM.render(
        <GoogleMaps
          markers={markers}
          refine={this._refine.bind(this, {helper})}
          refineOnMapInteraction={refineOnMapInteraction}
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

instantsearch.widgets.googleMaps = googleMaps;

export default googleMaps;
