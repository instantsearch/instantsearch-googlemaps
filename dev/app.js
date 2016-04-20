import instantsearch from 'instantsearch.js';
import googleMaps from '../index.js';
// x: -8, y: -25
const search = instantsearch({
  appId: 'latency',
  apiKey: '6be0576ff61c053d5f9a3225e2a90f76',
  indexName: 'airports',
  urlSync: true
});

const searchBox = instantsearch.widgets.searchBox({
  container: document.querySelector('#search-box')
});

const map = googleMaps({
  container: document.querySelector('#google-maps'),
  mapOptions: {
    disableDefaultUI: true,
    maxZoom: 15
  }
});

const hits = instantsearch.widgets.hits({
  container: document.querySelector('#hits'),
  hitsPerPage: 10,
  cssClasses: {
    item: 'clearfix'
  },
  templates: {
    item: ({
      airport_id: airportId,
      name,
      city,
      country
    }) => `<h2>${airportId} <small><i>${name}</i></small></h2>${city} ${country}`
  }
});

// This will go inside the widget
const setActiveHit = markerIndex => (hit, hitIndex) => {
  if (hitIndex === markerIndex) {
    hit.classList.add('ais-hits--item__marker-active');
  } else {
    hit.classList.remove('ais-hits--item__marker-active');
  }
};

map.on('marker enter', ({markerIndex}) =>
  document
    .querySelectorAll('#hits .ais-hits--item')[markerIndex]
    .classList.add('ais-hits--item__marker-hover')
);

map.on('marker leave', ({markerIndex}) =>
  document
    .querySelectorAll('#hits .ais-hits--item')[markerIndex]
    .classList.remove('ais-hits--item__marker-hover')
);

map.on('marker click', ({markerIndex}) => {
  [...document.querySelectorAll('#hits .ais-hits--item')].forEach(setActiveHit(markerIndex));
});

search.on('render', () => {
  const hitsItems = [...document.querySelectorAll('#hits .ais-hits--item')];
  hitsItems.forEach((hit, hitIndex) => {
    hit.addEventListener('mouseenter', () => {
      hit.classList.add('ais-hits--item__marker-hover');
      map.setHoverMarkerFromIndex(hitIndex);
    });
    hit.addEventListener('mouseleave', () => {
      hit.classList.remove('ais-hits--item__marker-hover');
      map.setHoverMarkerFromIndex(null);
    });
    hit.addEventListener('click', () => {
      hitsItems.forEach(setActiveHit(hitIndex));
      map.setActiveMarkerFromIndex(hitIndex);
    });
  });
});

search.addWidget(searchBox);
search.addWidget(map);
search.addWidget(hits);
search.start();
