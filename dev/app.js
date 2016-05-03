import instantsearch from 'instantsearch.js';
import googleMaps from '../index.js';
// x: -8, y: -25
const search = instantsearch({
  appId: '5HKNJ2188L',
  apiKey: '47191ce585bc888d84b253abfb1a2387',
  indexName: 'restaurants_us',
  urlSync: false
});

const searchBox = instantsearch.widgets.searchBox({
  container: document.querySelector('#search-box')
});

const map = googleMaps({
  container: document.querySelector('#map-container'),
  mapOptions: {
    zoomControl: true,
    zoomControlOptions: {
      position: google.maps.ControlPosition.TOP_LEFT
    },
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    rotateControl: false,
    fullscreenControl: false,
    maxZoom: 15
  },
  refineOnMapInteraction: true
});

const pagination = instantsearch.widgets.pagination({
  container: document.querySelector('#pagination'),
  cssClasses: {
    root: 'pagination',
    active: 'active'
  }
});

const getPrice = priceRange => {
  let out = '';
  for (let i = 0; i < priceRange; i++) out += '<span>$</span>';
  for (let i = 0; i < 4 - priceRange; i++) out += '<span class="gray">$</span>'
  return out;
};

const hits = instantsearch.widgets.hits({
  container: document.querySelector('#hits'),
  hitsPerPage: 50,
  templates: {
    item: ({
      name,
      city,
      neighborhood,
      stars_count: starsCount,
      reviews_count: reviewsCount,
      food_type: foodType,
      price: priceRange,
      image_url: imageUrl,
      reserve_url: reserveUrl
    }) => `<div class="media">
  <div class="media-left">
    <a href="${reserveUrl}">
      <img class="media-object" src="${imageUrl}" width=90 height=90>
    </a>
  </div>
  <div class="media-body">
    <h4 class="media-heading">${name}</h4>
    <div class="rating-price clearfix">
      <div class="pull-left">
        <div class="star-ratings-css">
          <div class="star-ratings-css-top" style="width: ${Math.round(starsCount*100/5)}%"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
          <div class="star-ratings-css-bottom"><span>★</span><span>★</span><span>★</span><span>★</span><span>★</span></div>
        </div>
        <span>(${reviewsCount})</span>
      </div>
      <div class="text-right">${getPrice(priceRange)}</div>
    </div>
    <div class="text-right">
      <a class="btn btn-default btn-xs" href="${reserveUrl}">reserve</a>
    </div>
    <div class="meta">${foodType} | ${city} | ${neighborhood}</div>
  </div>
</div>`
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
search.addWidget(pagination);
search.start();

const setMapHeight = () => {
  const mapContainer = document.querySelector('#map-container');
  const topMapPosition = mapContainer.getBoundingClientRect().top;
  const viewportHeight = document.documentElement.clientHeight;
  mapContainer.style.height = viewportHeight - topMapPosition + 'px';
  google.maps.event.trigger(map._map, 'resize');
};

const maybeFixedSearch = () => {
  const mapContainer = document.querySelector('#map-container');
  const resultsContainer = document.querySelector('#results');
  const mainContainer = document.querySelector('#main');
  const formContainer = document.querySelector('#form-container');
  let initialFormTopPos = formContainer.offsetTop;

  return () => {
    const yScroll = window.pageYOffset;
    const resultsRectangle = resultsContainer.getBoundingClientRect();
    const mainRectangle = mainContainer.getBoundingClientRect();

    if (yScroll >= initialFormTopPos) {
      formContainer.style.position = 'fixed';
      formContainer.style.top = 0;
      formContainer.style.left = mainRectangle.left + 'px';
      formContainer.style.width = mainRectangle.width + 'px';

      mapContainer.style.position = 'fixed';
      mapContainer.style.top = formContainer.getBoundingClientRect().bottom + 'px';
      mapContainer.style.left = resultsRectangle.right + 'px';
      mapContainer.style.width = mainRectangle.width - resultsRectangle.width + 'px';
    } else {
      formContainer.style.position = '';
      formContainer.style.top = '';
      mapContainer.style.position = '';
      mapContainer.style.top = '';
      mapContainer.style.left = '';
      mapContainer.style.width = '';
    }
  };
};

setMapHeight();
window.addEventListener('scroll', maybeFixedSearch());
window.addEventListener('resize', setMapHeight);
window.addEventListener('scroll', setMapHeight);
