logbook.factory('dataService', function($http) {
  _dataService = {};

  _dataService.getData = function(callback) {
    return $http.get("/api/data");
  }
  _dataService.getLatLngData = function(callback) {
  	return $http.get("/api/latlng");
  }
  _dataService.getDrivers = function(callback) {
    return $http.get("/api/drivers");
  }
  _dataService.getButtonStates = function(callback) {
    return $http.get("/api/stoptrip");
  }
  _dataService.togglePump1 = function(state) {
    return $http.get("/api/pump1/:" + state);
  }

  return _dataService;
});
