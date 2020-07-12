var logbook = angular.module('WMSFrontend', []);

logbook.controller('mainController', ['$scope', '$http', '$window', 'dataService', function($scope, $http, $window, dataService) {

	$scope.usage = "no signal";
	$scope.remaining = "no signal";
	
	var socket = io.connect();

	socket.on('reloadUsers', function(data) {
		$window.location.reload();
	});

	dataService.getData().then(function(data) {
	  	$scope.usage = data.data.used1;
	  	$scope.valve = data.data.using1;
	  	$scope.remaining = (parseFloat(data.data.limit1)-parseFloat(data.data.used1)).toFixed(3);
	});

	$scope.enableValve = function() {
	  	$scope.valve = true;
	  	dataService.toggleValveUser1(true);
	}

	$scope.disableValve = function() {
		$scope.valve = false;
		dataService.toggleValveUser1(false);
	}

}]);
