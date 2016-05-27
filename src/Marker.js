/* global google */

export default class Marker extends google.maps.OverlayView {
  constructor({latlng, template, offset, handleMouseEnter, handleMouseLeave, handleMouseClick}) {
    super();
    this._latlng = latlng;
    this._template = template;
    this._offset = {
      x: 0,
      y: 0,
      ...offset
    };
    this._handleMouseEnter = handleMouseEnter;
    this._handleMouseLeave = handleMouseLeave;
    this._handleMouseClick = handleMouseClick;
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
    this._container.classList.add('ais-googlemaps--marker');
    this._container.innerHTML = this._template();
    this._container.addEventListener('mouseenter', this._handleMouseEnter);
    this._container.addEventListener('mouseleave', this._handleMouseLeave);
    this._container.addEventListener('click', this._handleMouseClick);
    this.getPanes().overlayImage.appendChild(this._container);

    // now that the marker is added, let's compute the needed offset based on the content
    this._computedOffset = {
      x: this._offset.x - this._container.getBoundingClientRect().width / 2,
      y: this._offset.y - this._container.getBoundingClientRect().height
    };
  }

  onRemove() {
    this._container.parentNode.removeChild(this._container);
  }

  setHover(state) {
    if (state === true) {
      this._container && this._container.classList.add('ais-googlemaps--marker__hover');
    } else {
      this._container && this._container.classList.remove('ais-googlemaps--marker__hover');
    }
  }

  setActive(state) {
    if (state === true) {
      this._container && this._container.classList.add('ais-googlemaps--marker__active');
    } else {
      this._container && this._container.classList.remove('ais-googlemaps--marker__active');
    }
  }
}
