logbook.factory('dataService', function($http) {
  _dataService = {};

  _dataService.getData = function(callback) {
    return $http.get("/api/data");
  }
  _dataService.togglePump1 = function(state) {
    return $http.get("/api/pump1/:" + state);
  }
  _dataService.toggleValve1 = function(state) {
    return $http.get("/api/admin/valve1/:" + state);
  }
  _dataService.toggleValve2 = function(state) {
    return $http.get("/api/admin/valve2/:" + state);
  }
  _dataService.toggleValveUser1 = function(state) {
    return $http.get("/api/user/valve1/:" + state);
  }
  _dataService.toggleValveUser2 = function(state) {
    return $http.get("/api/user/valve2/:" + state);
  }
  _dataService.changeLimit1 = function(limit) {
    return $http.get("/api/limit1/:" + limit);
  }
  _dataService.changeLimit2 = function(limit) {
    return $http.get("/api/limit2/:" + limit);
  }
  _dataService.resetSystem = function(state) {
    return $http.get("/api/reset");
  }

  return _dataService;
});
