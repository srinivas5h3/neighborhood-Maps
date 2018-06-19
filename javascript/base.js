var  Location = function(data) {
  this.locname = data.locname;
  this.location = data.location;

};

var  ViewModel = function() {
  var  self = this;

  self.LocationsList = ko.observableArray([]);

  locations.forEach(function(location) {
    self.LocationsList.push(new Location(location));
  });
  
  self.mapError = ko.observable(false);

  self.filter = ko.observable('');
  self.filteredLocations = ko.computed(function() {
    var  filterResult = self.filter().toLowerCase();

    if (!filterResult) {
      for (var i = 0; i < self.LocationsList().length; i++) {
        
        if (self.LocationsList()[i].marker) {
          self.LocationsList()[i].marker.setVisible(true);
        }
      }
      return self.LocationsList();
    } else {
      return ko.utils.arrayFilter(self.LocationsList(), function(location) {
        
        var  match = location.locname.toLowerCase().indexOf(filterResult) >= 0;
        if (location.marker) {
          location.marker.setVisible(match);

        }
        return match;
      });
    }
  }, self);

  self.clearFilter = function() {
    self.filter('');
    
    for (var i = 0; i < self.LocationsList().length; i++) {
     
      self.LocationsList()[i].marker.setVisible(true);
    }
  };

  self.currentLocation = ko.observableArray([this.LocationsList()[0]]);

  this.selectLocation = function(clickedLocation) {
    
    self.currentLocation(clickedLocation);
    animateUponClick(clickedLocation.marker);
    
    populateInfoWindow(clickedLocation.marker, info);
  };
  self.visibleMenu = ko.observable(false),
 
  self.clickMe = function() {
    this.visibleMenu(!this.visibleMenu());
};

};

var  vm = new ViewModel();
ko.applyBindings(vm);
