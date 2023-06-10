import {Loader} from '@googlemaps/js-api-loader';

let map;

const loader = new Loader({
  apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  version: 'weekly',
});

loader.load().then(async () => {
  const {Map} = (await google.maps.importLibrary(
    'maps',
  )) as google.maps.MapsLibrary;
  map = new Map(document.getElementById('map') as HTMLElement, {
    center: {lat: -34.397, lng: 150.644},
    zoom: 8,
  });
});
