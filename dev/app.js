import instantsearch from 'instantsearch.js';
import googleMaps from '../index.js';

let search = instantsearch({
  appId: 'latency',
  apiKey: '6be0576ff61c053d5f9a3225e2a90f76',
  indexName: 'airports',
  urlSync: true
});

let searchBox = instantsearch.widgets.searchBox({
  container: document.querySelector('#search-box')
});

let map = googleMaps({
  container: document.querySelector('#google-maps'),
  // currently buggy because google mapt bounds and algolia geo bounds (aroundLatLng)
  // are somehow different, need more insights
  refineOnMapInteraction: false
});

let hits = instantsearch.widgets.hits({
  container: document.querySelector('#hits'),
  hitsPerPage: 10,
  templates: {
    item: ({
      airport_id,
      name,
      city,
      country
    }) => `<h2>${airport_id} <small><i>${name}</i></small></h2>${city} ${country}`
  }
});

search.addWidget(searchBox);
search.addWidget(map);
search.addWidget(hits);
search.start();
