/* global google */

import EventEmitter from 'events';

import instantsearch from 'instantsearch.js';
import Marker from './src/Marker.js';
import InfoBox from './src/InfoBox.js';
import pinIcon from './src/pin.svg';

import './src/style.css';

const defaultMapOptions = {};
const defaultTemplates = {
  marker: pinIcon,
  infoBox: ({hit, hitIndex}) => `Hit #${hitIndex}, objectID: ${hit.objectID}`
};
const defaultOffsets = {
  marker: {x: 0, y: 0},
  infoBox: {x: 0, y: -6}
};

/**
 * algolia/instantsearch.js widget to display your Algolia geo hits on a map using Google Maps APIs
 * @param  {DOMElement} options.container Where to insert the map in the document. This is required.
 * @return {EventEmitter}
 */
function googleMaps({
  container,
  templates = defaultTemplates,
  offsets = defaultOffsets,
  mapOptions = defaultMapOptions
}) {
  let widget = new EventEmitter();

  widget = {
    init() {
      this._map = new google.maps.Map(container, mapOptions);
      this._currentMarkers = [];
      container.classList.add('ais-google-maps');
    },

    render({results}) {
      this._currentHits = results.hits;
      this._currentMarkers.forEach(marker => marker.setMap(null));
      this._currentMarkers = [];

      const bounds = new google.maps.LatLngBounds();
      results.hits.forEach((hit, markerIndex) => {
        const latlng = new google.maps.LatLng(hit._geoloc);
        bounds.extend(latlng);
        const marker = new Marker({
          latlng,
          template: () => templates.marker,
          offset: offsets.marker,
          handleMouseEnter: () => {
            this.setHoverMarkerFromIndex(markerIndex);
            this.emit('marker enter', {hit, markerIndex});
          },
          handleMouseLeave: () => {
            this.setHoverMarkerFromIndex(null);
            this.emit('marker leave', {hit, markerIndex});
          },
          handleMouseClick: () => {
            this.setActiveMarkerFromIndex(markerIndex);
            this.emit('marker click', {hit, markerIndex});
          }
        });
        marker.setMap(this._map);
        this._currentMarkers.push(marker);
      });

      this._map.fitBounds(bounds);
    },

    setHoverMarkerFromIndex(askedMarkedIndex) {
      this._currentMarkers.forEach((marker, markerIndex) => {
        if (askedMarkedIndex === markerIndex) {
          marker.setHover(true);
        } else {
          marker.setHover(false);
        }
      });
    },

    setActiveMarkerFromIndex(askedMarkedIndex) {
      this._currentMarkers.forEach((marker, markerIndex) => {
        if (askedMarkedIndex === markerIndex) {
          marker.setActive(true);
        } else {
          marker.setActive(false);
        }
      });

      const marker = this._currentMarkers[askedMarkedIndex];
      const hit = this._currentHits[askedMarkedIndex];
      if (!this._currentInfoBox || this._currentInfoBoxIndex !== askedMarkedIndex) {
        if (this._currentInfoBox) {
          this._currentInfoBox.setMap(null);
        }

        const infoBox = new InfoBox({
          latlng: marker._latlng,
          offset: {
            x: offsets.infoBox.x,
            y: -marker._container.getBoundingClientRect().height + offsets.infoBox.y
          },
          template: templates.infoBox.bind(null, {hit, hitIndex: askedMarkedIndex})
        });

        infoBox.setMap(this._map);
        this._currentInfoBox = infoBox;
        this._currentInfoBoxIndex = askedMarkedIndex;
      }
    },
    ...widget,
    ...EventEmitter.prototype
  };

  return widget;
}

instantsearch.widgets.googleMaps = googleMaps;

export default googleMaps;
