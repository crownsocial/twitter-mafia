document.addEventListener("DOMContentLoaded", function() {
  L.mapbox.accessToken = 'pk.eyJ1IjoiYmVubmV0dHNsaW4iLCJhIjoiYzU0V200YyJ9._G57JU3841MTuFULQD9pVg';
  var map = L.mapbox.map('map', 'bennettslin.mn077oa9')
      .setView([47.6244, -122.3317], 11);
  map.scrollWheelZoom.disable();
});

