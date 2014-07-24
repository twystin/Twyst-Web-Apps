var twystConsole = angular.module('twystConsole', ['ngCookies', 'ui.bootstrap', 'ngRoute']);

twystConsole.config(function ($routeProvider) {
	$routeProvider.
	when('/', {
		controller: AuthController,
		templateUrl: '/console/templates/landing.html'
	}).
	when('/dashboard', {
		controller: PublicController,
		templateUrl: '/console/templates/dashboard.html'
	}).
	when('/qr', {
		controller: UsersController,
		templateUrl: '/console/templates/qr/qr.html'
	}).
	when('/qrs', {
		controller: AdminQrCtrl,
		templateUrl: '/console/templates/qr/view.html'
	}).
	when('/recco_config', {
		controller: ReccoController,
		templateUrl: '/console/templates/recco/config.html'
	}).
	when('/users/', {
		controller: AdminUserCtrl,
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
		controller: AdminOutletCtrl,
		templateUrl: '/console/templates/outlets/view.html',
	}).
	when('/programs', {
		controller: AdminProgramCtrl,
		templateUrl: '/console/templates/programs/view.html',
	}).
	when('/outlets/edit/:outlet_id', {
		controller: UsersController,
		templateUrl: '/console/templates/outlets/edit.html',
	}).
	when('/notifs', {
		controller: NotifController,
		templateUrl: '/console/templates/notifs/notif.html',
	}).
	when('/data', {
		controller: DataCtrl,
		templateUrl: '/console/templates/data/analytics.html',
	}).
	otherwise({
		redirectTo: '/error'
	});
});
