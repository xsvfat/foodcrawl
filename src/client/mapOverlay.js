// This example creates a custom overlay called LocalZoomOverlay, containing
// a U.S. Geological Survey (USGS) image of the relevant area on the map.

// Set the custom overlay object's prototype to a new instance
// of OverlayView. In effect, this will subclass the overlay class therefore
// it's simpler to load the API synchronously, using
// google.maps.event.addDomListener().
// Note that we set the prototype to an instance, rather than the
// parent class itself, because we do not wish to modify the parent class.

var overlay;
LocalZoomOverlay.prototype = new google.maps.OverlayView();

// Initialize the map and the custom overlay.

function initMap() {

  $zoomMap = $('div');
  $zoomMap.attr('id','zoomMap');
  $zoomMap.css({height: '100px', width: '100px'});

  var map = new google.maps.Map($zoomMap, {
    zoom: 18,
    center: {lat: 37.773972, lng: -122.431297},
    mapTypeId: 'satellite'
  });

  var bounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(37.281819, -123),
      new google.maps.LatLng(38, -122));
  // The custom LocalZoomOverlay object contains the USGS image,
  // the bounds of the image, and a reference to the map.
  overlay = new LocalZoomOverlay($zoomMap, bounds);
}

/** @constructor */
function LocalZoomOverlay(map, bounds) {

  this.map_ = map;
  this.bounds_ = bounds;

  // Define a property to hold the image's div. We'll
  // actually create this div upon receipt of the onAdd()
  // method so we'll leave it null for now.
  this.div_ = null;

  // Explicitly call setMap on this overlay.
  this.setMap(map);
}

/**
 * onAdd is called when the map's panes are ready and the overlay has been
 * added to the map.
 */
LocalZoomOverlay.prototype.onAdd = function() {

  $zoomMap = $('div');
  $zoomMap.attr('id','zoomMap');
  $zoomMap.css({height: '100px', width: '100px'});

  var map = new google.maps.Map($zoomMap, {
    zoom: 18,
    center: {lat: 37.773972, lng: -122.431297},
    mapTypeId: 'satellite'
  });

  this.div_ = $zoomMap;

  // Add the element to the "overlayLayer" pane.
  var panes = this.getPanes();
  panes.overlayLayer.appendChild($zoomMap);

};

LocalZoomOverlay.prototype.draw = function() {

  // We use the south-west and north-east
  // coordinates of the overlay to peg it to the correct position and size.
  // To do this, we need to retrieve the projection from the overlay.
  var overlayProjection = this.getProjection();

  // Retrieve the south-west and north-east coordinates of this overlay
  // in LatLngs and convert them to pixel coordinates.
  // We'll use these coordinates to resize the div.
  var sw = overlayProjection.fromLatLngToDivPixel(this.bounds_.getSouthWest());
  var ne = overlayProjection.fromLatLngToDivPixel(this.bounds_.getNorthEast());

  // Resize the image's div to fit the indicated dimensions.
  var div = this.div_;
  div.style.left = sw.x + 'px';
  div.style.top = ne.y + 'px';
  div.style.width = (ne.x - sw.x) + 'px';
  div.style.height = (sw.y - ne.y) + 'px';
};

// The onRemove() method will be called automatically from the API if
// we ever set the overlay's map property to 'null'.
LocalZoomOverlay.prototype.onRemove = function() {
  this.div_.parentNode.removeChild(this.div_);
  this.div_ = null;
};

// Set the visibility to 'hidden' or 'visible'.
LocalZoomOverlay.prototype.hide = function() {
  if (this.div_) {
    // The visibility property must be a string enclosed in quotes.
    this.div_.style.visibility = 'hidden';
  }
};

LocalZoomOverlay.prototype.show = function() {
  if (this.div_) {
    this.div_.style.visibility = 'visible';
  }
};

LocalZoomOverlay.prototype.toggle = function() {
  if (this.div_) {
    if (this.div_.style.visibility === 'hidden') {
      this.show();
    } else {
      this.hide();
    }
  }
};

// Detach the map from the DOM via toggleDOM().
// Note that if we later reattach the map, it will be visible again,
// because the containing <div> is recreated in the overlay's onAdd() method.
LocalZoomOverlay.prototype.toggleDOM = function() {
  if (this.getMap()) {
    // Note: setMap(null) calls OverlayView.onRemove()
    this.setMap(null);
  } else {
    this.setMap(this.map_);
  }
};

// <!-- Add an input button to initiate the toggle method on the overlay. -->
//     <div id="floating-panel">
//       <input type="button" value="Toggle visibility" onclick="overlay.toggle();"></input>
//       <input type="button" value="Toggle DOM attachment" onclick="overlay.toggleDOM();"></input>
//     </div>
