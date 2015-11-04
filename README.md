# instantsearch-googlemaps

[React](http://facebook.github.io/react/) [algolia/instantsearch.js](https://github.com/algolia/instantsearch.js/) widget to display your [Algolia geo hits](https://www.algolia.com/doc/rest#geo-search-parameters) on a map using [Google Maps APIs](https://developers.google.com/maps/)

[![Version][version-svg]][package-url] [![Build Status][travis-svg]][travis-url] [![License][license-image]][license-url] [![Downloads][downloads-image]][downloads-url]

[travis-svg]: https://img.shields.io/travis/instantsearch/instantsearch-googlemaps/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/instantsearch/instantsearch-googlemaps
[license-image]: http://img.shields.io/badge/license-MIT-green.svg?style=flat-square
[license-url]: LICENSE
[downloads-image]: https://img.shields.io/npm/dm/instantsearch-googlemaps.svg?style=flat-square
[downloads-url]: http://npm-stat.com/charts.html?package=instantsearch-googlemaps
[version-svg]: https://img.shields.io/npm/v/instantsearch-googlemaps.svg?style=flat-square
[package-url]: https://npmjs.org/package/instantsearch-googlemaps

## Install

### From a CDN

instantsearch-googlemaps is available on [jsDelivr](http://www.jsdelivr.com/):

Add the instantsearch CSS to the `<head>`:

```html
<link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/instantsearch.js/0/instantsearch.min.css" />
```

Load the JavaScript files where relevant:

```js
<script src="https://maps.googleapis.com/maps/api/js"></script>
<script src="//cdn.jsdelivr.net/instantsearch.js/0/instantsearch.min.js"></script>
<script src="//cdn.jsdelivr.net/instantsearch-googlemaps/0/instantsearch-googlemaps.min.js"></script>
```

### With npm, browserify, webpack

```sh
npm install instantsearch-googlemaps --save
```

## Usage

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

#### props.defaultZoom

#### props.defaultCenter

## Development

```sh
npm run dev
```

## Testing
