var logbook = angular.module('WMSFrontend', []);

logbook.controller('mainController', ['$scope', '$http', '$window', 'dataService', function($scope, $http, $window, dataService) {

  $scope.tank1 = "no signal";
  $scope.tank2 = "no signal";
  $scope.user1 = "no signal";
  $scope.user2 = "no signal";

  $scope.pump1 = false;

  var socket = io.connect();
  
  dataService.getData().then(function(data) {
  	$scope.tank1 = data.data.text;
  	$scope.tank2 = data.data.pump1;
  	$scope.pump1 = data.data.pump1;
  });
  
  /*socket.on('buttonStates', function(data) {
    $scope.pump1 = (data == 'true');
  });*/
  
  /**
   * function for buttons of pump 1
   * toggles button and sends state to backend
   */
  $scope.enablePump1 = function() {
  	$scope.pump1 = true;
    dataService.togglePump1(true);
  }
  
  $scope.disablePump1 = function() {
  	$scope.pump1 = false;
    dataService.togglePump1(false);
  }

}]);
