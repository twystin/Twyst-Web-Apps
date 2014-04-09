var twystConsole = angular.module('twystConsole', ['ngCookies', 'ui.bootstrap', 'ngRoute']);

twystConsole.config(function ($routeProvider) {
	$routeProvider.
	when('/', {
		controller: PublicController,
		templateUrl: '/console/templates/dashboard.html'
	}).
	when('/qr', {
		controller: UsersController,
		templateUrl: '/console/templates/qr/qr.html'
	}).
	when('/users/view', {
		controller: UsersController,
		templateUrl: '/console/templates/users/view.html',
	}).
	when('/users/create', {
		controller: UsersController,
		templateUrl: '/console/templates/users/create.html'
	}).
	when('/users/edit/:username', {
		controller: UsersController,
		templateUrl: '/console/templates/users/edit.html',
	}).
	when('/outlets', {
		controller: UsersController,
		templateUrl: '/console/templates/outlets/view.html',
	}).
	when('/outlets/edit/:outlet_id', {
		controller: UsersController,
		templateUrl: '/console/templates/outlets/edit.html',
	}).
	when('/notifs', {
		controller: NotifController,
		templateUrl: '/console/templates/notifs/notif.html',
	}).
	otherwise({
		redirectTo: '/error'
	});
});
