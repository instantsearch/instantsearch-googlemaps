/* global google */

import EventEmitter from 'events';

import instantsearch from 'instantsearch.js';
import Marker from './src/Marker.js';
import InfoBox from './src/InfoBox.js';
import pinIcon from './src/pin.svg';

import './src/style.css';

const defaultMapOptions = {};
const defaultTemplates = {
  marker: () => pinIcon,
  infoBox: ({hit, hitIndex}) => `Hit #${hitIndex}, objectID: ${hit.objectID}`
};
const defaultOffsets = {
  marker: {x: 0, y: 0},
  infoBox: {x: 0, y: -12}
};


/**
 * algolia/instantsearch.js widget to display your Algolia geo hits on a map using Google Maps APIs
 * @param  {DOMElement} options.container Where to insert the map in the document. This is required.
 * @return {EventEmitter}
 */
function googleMaps({
  container,
  templates = {},
  offsets = defaultOffsets,
  mapOptions = defaultMapOptions,
  refineOnMapInteraction = false
}) {
  let widget = new EventEmitter();
  templates = Object.assign({}, defaultTemplates, templates);

  widget = {
    _userRefine(helper) {
      // console.log("_userRefine");
      // if (this._currentHits.length === 0)
      //   return;

      const bounds = this._map.getBounds();

      if (bounds) {
        this.emit('viewport changed', {bounds});
      }

      if (!this._refineOnMapInteraction) {
        return;
      }

      if (this._ignoreZoomChange) {
        this._ignoreZoomChange = false;
        return;
      }

      if (bounds === null) {
        return;
      }

      // console.log("_userRefine passed");
      const paddedBounds = padBounds(bounds, -0.05);
      const p1 = paddedBounds.getNorthEast();
      const p2 = paddedBounds.getSouthWest();
      const box = [p1.lat(), p1.lng(), p2.lat(), p2.lng()];
      const mapZoom = this._map.getZoom();
      const mapCenter = this._map.getCenter();
      helper.setQueryParameter('insideBoundingBox', box.join(','));
      helper.setQueryParameter('aroundLatLng');
      helper.setPage(0);
      this._map && history.replaceState({
        zoom: mapZoom,
        center: mapCenter && mapCenter.toJSON()
      }, null);
      helper.search();
    },

    init({helper}) {
      this._map = new google.maps.Map(container, mapOptions);
      this._currentMarkers = [];
      this._userRefine = this._userRefine.bind(this, helper);
      this._refineOnMapInteraction = refineOnMapInteraction;
      this._userMouseOverMap = false;
      var that = this;

      container.classList.add('ais-googlemaps');

      this._map.addListener('dragend', this._userRefine);
      this._map.addListener('zoom_changed', function() {
        // console.log("zoom_changed");
        if (that._userMouseOverMap) {
          that._userRefine();
        }
      });
      container.addEventListener('mouseleave', () => {
        that._userMouseOverMap = false;
      });
      container.addEventListener('mouseenter', () => {
        that._userMouseOverMap = true;
      });
    },

    render({results, state}) {
      this._currentHits = results.hits;

      this._currentMarkers.forEach(marker => marker.setMap(null));
      if (this._currentInfoBox) {
        this._currentInfoBox.setMap(null);
      }
      this._currentMarkers = [];

      const bounds = new google.maps.LatLngBounds();
      results.hits.forEach((hit, markerIndex) => {
        const latlng = new google.maps.LatLng(hit._geoloc);
        bounds.extend(latlng);
        const marker = new Marker({
          latlng,
          template: templates.marker,
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

      if (state.getQueryParameter('insideBoundingBox') !== undefined) {
        if (history.state && history.state.zoom !== undefined) {
          this._ignoreZoomChange = true;
          this._map.setCenter(history.state.center);
          this._map.setZoom(history.state.zoom);
        }
        return;
      }

      if (this._currentHits.length === 0 && this._map.getZoom()) {
        return;
      }

      this._ignoreZoomChange = true;
      this._map.fitBounds(padBounds(bounds, -0.05));
      history.replaceState({
        zoom: this._map.getZoom(),
        center: this._map.getCenter().toJSON()
      }, null);
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

    setRefineOnMapInteraction(active) {
      this._refineOnMapInteraction = active;
    },

    refreshMap() {
      this._userRefine();
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
    ...EventEmitter.prototype,
  };

  return widget;
}

function padBounds(bounds, bufferRatio) {
  var sw = bounds.getSouthWest();
  var ne = bounds.getNorthEast();
  var heightBuffer = Math.abs(sw.lat() - ne.lat()) * bufferRatio;
  var widthBuffer = Math.abs(sw.lng() - ne.lng()) * bufferRatio;

  return new google.maps.LatLngBounds(
    new google.maps.LatLng(sw.lat() - heightBuffer, sw.lng() - widthBuffer),
    new google.maps.LatLng(ne.lat() + heightBuffer, ne.lng() + widthBuffer));
}

instantsearch.widgets.googleMaps = googleMaps;

export default googleMaps;
