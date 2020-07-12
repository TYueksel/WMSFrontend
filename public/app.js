var logbook = angular.module('WMSFrontend', []);

logbook.controller('mainController', ['$scope', '$http', '$window', 'dataService', function($scope, $http, $window, dataService) {

  $scope.ready = false;

  $scope.tank1 = "no signal";
  $scope.tank2 = "no signal";
  $scope.turbidity = "no signal";
  $scope.user1 = "no signal";
  $scope.user2 = "no signal";
  $scope.userLimit1 = 0;
  $scope.userLimit2 = 0;
  
  $scope.pump1 = false;
  $scope.valve1 = false;
  $scope.valve2 = false;

  var socket = io.connect();
  
  socket.on('reloadPage', function(data) {
    $window.location.reload();
  });
  
  dataService.getData().then(function(data) {
  	if(data.data.tank1 !== null) $scope.tank1 = data.data.tank1;
  	if(data.data.tank2 !== null) $scope.tank2 = data.data.tank2;
  	if(data.data.turbidity !== null) $scope.turbidity = data.data.turbidity + " NTU";
  	$scope.pump1 = data.data.pump1;
  	$scope.valve1 = data.data.valve1;
  	$scope.valve2 = data.data.valve2;
  	if(data.data.used1 !== null) $scope.user1 = data.data.used1 + " Liter";
  	if(data.data.used2 !== null) $scope.user2 = data.data.used2 + " Liter";
  	$scope.userLimit1 = parseFloat(data.data.limit1);
  	$scope.userLimit2 = parseFloat(data.data.limit2);
  	
  	$scope.ready = true;
  });
  
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
  
  $scope.enableValve1 = function() {
  	$scope.valve1 = true;
    dataService.toggleValve1(true);
  }
  
  $scope.disableValve1 = function() {
  	$scope.valve1 = false;
  	dataService.toggleValve1(false);
  }
  
  $scope.enableValve2 = function() {
  	$scope.valve2 = true;
    dataService.toggleValve2(true);
  }
  
  $scope.disableValve2 = function() {
  	$scope.valve2 = false;
  	dataService.toggleValve2(false);
  }
  
  $scope.submit1 = function() {
  	if($scope.userLimit1 == null) {
  		return;
  	}
  	if($scope.userLimit1 < $scope.user1) {
  		$scope.userLimit1 = $scope.user1;
  	} else {
    	dataService.changeLimit1($scope.userLimit1);
    }
  }
  
  $scope.submit2 = function() {
  	if($scope.userLimit2 == null) {
  		return;
  	}
  	if($scope.userLimit2 < $scope.user2) {
  		$scope.userLimit2 = $scope.user2;
  	} else {
  		dataService.changeLimit2($scope.userLimit2);
  	}
  }
  
  $scope.reset = function() {
  	dataService.resetSystem();
  }

}]);
