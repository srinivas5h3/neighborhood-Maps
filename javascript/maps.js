var  map;
var  info;
var  locations = [
  {
    locname: "Indian gate",
    location: {
      lat:28.63769,
      lng:77.205824
    }
  },  {
    locname: 'Himalayas',
    location: {
      lat: 32.3700217,
      lng: 77.2503031
    }
  }, {
    locname: 'Varanasi',
    location: {
      lat: 25.3176452,
      lng: 82.9739144
    }
  }, {
    locname: 'Athirappilly Water Falls',
    location: {
      lat: 10.2854334,
      lng: 76.5676206
    }
  }, {
    locname: 'Charminar',
    location: {
      lat: 17.3615509,
      lng: 78.4745241
    }
  },
];
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {
      lat: 40.7413549,
      lng: -73.9980244
    },
    zoom: 13,
    mapTypeControl: false
  });

  var  largeInfowindow = new google.maps.InfoWindow();
  info = new google.maps.InfoWindow();
  var  bounds = new google.maps.LatLngBounds();
  for (var  i = 0; i < locations.length; i++) {
    var  position = locations[i].location;
    var  locname = locations[i].locname;
    var marker = new google.maps.Marker({
      map: map,
      position: position,
      locname: locname,
      animation: google.maps.Animation.DROP,
      id:i
    });
    marker.setVisible(true);
    vm.LocationsList()[i].marker = marker;
    bounds.extend(marker.position);

    marker.addListener('click', function() {
      populateInfoWindow(this, info);
      animateUponClick(this);
    });

  }
  map.fitBounds(bounds);
} 
function animateUponClick(marker) {
  marker.setAnimation(google.maps.Animation.BOUNCE);
  setTimeout(function() {
    marker.setAnimation(null);
  }, 1460);
}

function populateInfoWindow(marker, infowin) {
  if (infowin.marker != marker) {
    
    infowin.setContent('');
    infowin.marker = marker;
    infowin.addListener('closeclick', function() {
      infowin.marker = null;
    });
    var streetViewService = new google.maps.StreetViewService();
    var radius = 50;
    
    function getStreetView(par, status) {
      if (status == google.maps.StreetViewStatus.OK) {
        var nearStreetViewLocation = par.location.latLng;
        var heading = google.maps.geometry.spherical.computeHeading(nearStreetViewLocation, marker.position);
        var panoramaOptions = {
          position: nearStreetViewLocation,
          pov: {
            heading: heading,
            pitch: 30
          }
        };
        var panorama = new google.maps.StreetViewPanorama(document.getElementById('pano'), panoramaOptions);
      } else {
        infowin.setContent('<div>' + marker.locname + '</div>' + '<div>No Street View Found</div>');
      }
    }

    var  wikiURL = 'http://en.wikipedia.org/w/api.php?action=opensearch&search=' + marker.locname + '&format=json&callback=wikiCallback';
    $.ajax(wikiURL,{
      dataType: "jsonp",
      par: {
        async: true
      }
    }).done(function(response) {
      var  articleStr = response[1];
      var  URL = 'http://en.wikipedia.org/wiki/' + articleStr;

      streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
      infowin.setContent('<div>' +
        '<h3>' + marker.locname + '</h3>' + '</div><br><a href ="' + URL + '">' + URL + '</a><hr><div id="pano"></div>');
      infowin.open(map, marker);
    }).fail(function(jqXHR, textStatus) {
      streetViewService.getPanoramaByLocation(marker.position, radius, getStreetView);
      infowin.setContent('<div>' +
        '<h3>' + marker.locname + '</h3>' + '</div><br><p>Sorry. We could not contact Wikipedia! </p><hr><div id="pano"></div>');
        infowin.open(map, marker);
    });

  }

} 
var error = function() {
  
  vm.mapError(true);
};
