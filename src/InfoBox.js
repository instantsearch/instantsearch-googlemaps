/* global google */

export default class InfoBox extends google.maps.OverlayView {
  constructor({latlng, template, offset}) {
    super();
    this._latlng = latlng;
    this._template = template;
    this._offset = {
      x: 0,
      y: 0,
      ...offset
    };
  }

  draw() {
    // adjust Marker position given it's offset/width
    const point = this.getProjection().fromLatLngToDivPixel(this._latlng);
    this._container.style.left = `${(point.x + this._computedOffset.x)}px`;
    this._container.style.top = `${(point.y + this._computedOffset.y)}px`;
  }

  onAdd() {
    this._container = document.createElement('div');
    this._container.style.position = 'absolute';
    this._container.classList.add('ais-google-maps--infobox');
    this._container.innerHTML = this._template();
    this.getPanes().overlayImage.appendChild(this._container);

    // now that the infoBox is added, let's compute the needed offset based on the content
    this._computedOffset = {
      x: this._offset.x - this._container.getBoundingClientRect().width / 2,
      y: this._offset.y - this._container.getBoundingClientRect().height
    };
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
  }
}
