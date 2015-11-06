import instantsearch from 'instantsearch.js';
import googleMaps from '../index.js';

let search = instantsearch({
  appId: 'latency',
  apiKey: '6be0576ff61c053d5f9a3225e2a90f76',
  indexName: 'airports',
  urlSync: true,
  searchParameters: {
    hitsPerPage: 50
  }
});

let searchBox = instantsearch.widgets.searchBox({
  container: document.querySelector('#search-box')
});

let map = googleMaps({
  container: document.querySelector('#google-maps'),
  prepareMakerData: ({airport_id: label, name: title}) => ({label, title})
});

search.addWidget(searchBox);
search.addWidget(map);
search.start();
