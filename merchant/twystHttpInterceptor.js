angular.module('twystHttp', [])
.factory('twystHttpInterceptor',
	['$q', '$window', '$injector', "$cookieStore", "$location", '_START_REQUEST_', '_END_REQUEST_','authService', function($q, $window, $injector, $cookieStore, $location, _START_REQUEST_, _END_REQUEST_, authService) { 
		
		var rootScope;
		rootScope = rootScope || $injector.get('$rootScope');
		
		var ongoingRequestCount = 0,
			updateUILoadingState = function () {
				if (ongoingRequestCount > 0) {
					
					rootScope.$broadcast(_START_REQUEST_);
				} else {
					
					rootScope.$broadcast(_END_REQUEST_);
				}
			};

		return {
			request: function (request) {
				rootScope.errorMessage = null;
				++ongoingRequestCount;
				updateUILoadingState();
				return request;
			},

			requestError: function (request) {
				rootScope.errorMessage = "Error in request";
				return request;
			},

			response: function(response) {
				rootScope.errorMessage = null;
				--ongoingRequestCount;
				updateUILoadingState();
				return response;
			},

			responseError: function (response) {
				--ongoingRequestCount;
				if (response.status === 500) {
					rootScope.errorMessage = 'Internal server error.';
				}  else if (response.status === 403) {
					rootScope.errorMessage = 'You are not supposed to be here!';
				}
                else if (response.status === 401) {
					if($cookieStore.get('logged_in')) {
						$cookieStore.remove('logged_in');
				        $cookieStore.remove('user');
				        $cookieStore.remove('_id');
				        authService.setAuthStatus(false, null, null, null);
				        $location.path('/');
					}
					else {
						rootScope.errorMessage = 'We got an Authentication failure. Try logging in again.';
					}
				} else {
					rootScope.errorMessage = response.data.message;
				}
				updateUILoadingState();
				return $q.reject(response);
			}
        };
}]);
