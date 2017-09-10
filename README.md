# DEPRECATED

This module is currently too buggy and complex for us to support it. It's a nice example on how to integrate with google maps
but we do not support it. Have a look, build and plug your own module using instantsearch custom widgets and see for yourself.

Here's a simple example on how to plug InstantSearch.js to google maps: https://jsfiddle.net/wkjyev3p/8/

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

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
**Table of Contents**  *generated with [DocToc](https://github.com/thlorenz/doctoc)*

- [Features](#features)
- [Install](#install)
  - [From a CDN](#from-a-cdn)
  - [With npm, browserify, webpack](#with-npm-browserify-webpack)
- [Usage](#usage)
  - [Algolia requirements](#algolia-requirements)
  - [`<script>`](#script)
  - [npm](#npm)
  - [API](#api)
- [Development](#development)
- [Testing](#testing)
- [Publish](#publish)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Features

- display your objects on a [Google Map](https://developers.google.com/maps/documentation/javascript/)
- refine search on zoom or drag as an option
- adjust the map on window resize if needed

![Demo of the instantsearchGoogleMaps widget][demo]

## Install

### From a CDN

instantsearch-googlemaps is available on [jsDelivr](http://www.jsdelivr.com/):

Add the instantsearch CSS to the `<head>`:

```html
<link rel="stylesheet" type="text/css" href="//cdn.jsdelivr.net/npm/instantsearch.js@1/dist/instantsearch.min.css" />
```

Load the JavaScript files where relevant:

```html
<!-- https://developers.google.com/maps/documentation/javascript/tutorial -->
<script src="//maps.googleapis.com/maps/api/js?key=YOUR_API_KEY"></script>
<script src="//cdn.jsdelivr.net/npm/instantsearch.js@1/dist/instantsearch.min.js"></script>
<script src="//cdn.jsdelivr.net/npm/instantsearch-googlemaps@1/dist/instantsearch-googlemaps.min.js"></script>
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
  instantsearch.widgets.googleMaps({
    container: document.querySelector('#map'),
    // prepareMarkerData
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
    container: document.querySelector('#map'),
    // prepareMarkerData
  })
);
```

### API

#### options.container | DOMELement (required)

Where to insert the map in the document. This is required.

#### options.prepareMarkerData | function

Called for every hit, this is the moment where you can select the label and title
for the marker. This function should return an object in the form of `{label, title}`.

Example:

```js
function prepareMarkerData(hit, index, hits) {
  return {
    label: hit.name,
    title: hit.description
  }
}
```

The `label` first letter will be displayed on the marker on the map.

The `title` will be displayed when hovering the marker.

By default we use the current hit index in the results as the label and the hit `ObjectID` for the title.

#### options.refineOnMapInteraction | boolean

Should we refine the search on map interaction, default to false.

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

## Publish

```sh
SEMVER_TOKEN=minor npm run release
```
