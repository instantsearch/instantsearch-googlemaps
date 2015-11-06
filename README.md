# instantsearch-googlemaps _BETA_

[algolia/instantsearch.js](https://github.com/algolia/instantsearch.js/) widget to display your [Algolia geo hits](https://www.algolia.com/doc/rest#geo-search-parameters) on a map using [Google Maps APIs](https://developers.google.com/maps/)

[![Version][version-svg]][package-url] [![Build Status][travis-svg]][travis-url] [![License][license-image]][license-url] [![Downloads][downloads-image]][downloads-url]

[travis-svg]: https://img.shields.io/travis/instantsearch/instantsearch-googlemaps/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/instantsearch/instantsearch-googlemaps
[license-image]: http://img.shields.io/badge/license-MIT-green.svg?style=flat-square
[license-url]: LICENSE
[downloads-image]: https://img.shields.io/npm/dm/instantsearch-googlemaps.svg?style=flat-square
[downloads-url]: http://npm-stat.com/charts.html?package=instantsearch-googlemaps
[version-svg]: https://img.shields.io/npm/v/instantsearch-googlemaps.svg?style=flat-square
[package-url]: https://npmjs.org/package/instantsearch-googlemaps
[demo]: ./demo.gif

## Features

- display your objects on a [Google Map](https://developers.google.com/maps/documentation/javascript/)
- refine search on zoom or drag

![Demo of the instantsearchGoogleMaps widget][demo]

## Install

### From a CDN

instantsearch-googlemaps is available on [jsDelivr](http://www.jsdelivr.com/):

Add the instantsearch CSS to the `<head>`:

```html
<link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/instantsearch.js/0/instantsearch.min.css" />
```

Load the JavaScript files where relevant:

```html
<!-- https://developers.google.com/maps/documentation/javascript/tutorial -->
<script src="//maps.googleapis.com/maps/api/js?key=YOUR_API_KEY"></script>
<script src="//cdn.jsdelivr.net/instantsearch.js/0/instantsearch.min.js"></script>
<script src="//cdn.jsdelivr.net/instantsearch-googlemaps/0/instantsearch-googlemaps.min.js"></script>
```

### With npm, browserify, webpack

```sh
npm install instantsearch-googlemaps --save
```

## Usage

### Algolia requirements

To display your objects on a map, they will need to have a `_geoloc` attribute.

```json
{
  "_geoloc": {"lat": 33.636719, "lng": -84.428067}
}
```

### `<script>`

```js
var search = instantsearch({...});
search.addWidget(
  instantsearchGoogleMaps({
    container: '#search-box',
    // options
  })
);
```

### npm

```js
var instantsearch = require('instantsearch.js');
var instantsearchGoogleMaps = require('instantsearch-googlemaps');
var search = instantsearch({...});
search.addWidget(
  instantsearchGoogleMaps({
    container: '#search-box',
    // options
  })
);
```

### API

## Development

```sh
npm install
npm run dev
```

## Testing

```sh
npm install
npm test
```
