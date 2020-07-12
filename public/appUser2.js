var logbook = angular.module('WMSFrontend', []);

logbook.controller('mainController', ['$scope', '$http', '$window', 'dataService', function($scope, $http, $window, dataService) {

	$scope.usage = "no signal";
	$scope.remaining = "no signal";
	
	var socket = io.connect();

	socket.on('reloadUsers', function(data) {
		$window.location.reload();
	});

	dataService.getData().then(function(data) {
	  	$scope.usage = data.data.used2;
	  	$scope.valve = data.data.using2;
	  	$scope.remaining = (parseFloat(data.data.limit2)-parseFloat(data.data.used2)).toFixed(3);
	});

	$scope.enableValve = function() {
	  	$scope.valve = true;
	  	dataService.toggleValveUser2(true);
	}

	$scope.disableValve = function() {
		$scope.valve = false;
		dataService.toggleValveUser2(false);
	}

}]);
