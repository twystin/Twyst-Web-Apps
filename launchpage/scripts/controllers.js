var twystBeta = angular.module('twystBeta', []);

function BetaController($http, $scope) {
	$scope.user = {email : ""};
	$scope.merchant = {establishment_name : "", person_name: "", phone_number: ""};
	$scope.user.notify = false;
	$scope.user.thankyou = false;
	$scope.user.error = false;
	$scope.merchant.thank_you = false;
	$scope.merchant.error = false;
	$scope.merchant.dis = true;

	$scope.$watch('merchant', function() {
		if ($scope.merchant.establishment_name !== "" && $scope.merchant.phone_number !== "" && $scope.merchant.person_name !== "")
			$scope.merchant.dis = false;	
	}, true)


	$scope.notifyMe = function() {
		if($scope.user.email && $scope.user.city) {
			$http.post('/api/v1/beta/users', {email: $scope.user.email, city: $scope.user.city}).success(function(data, status, header, config){
				$scope.user.thankyou = true;
			}).error(function(data, status, header, config){
				$scope.user.error = true;
				$scope.user.thankyou = false;
			});
		}
	}


	$scope.addMerchantToBeta = function() {
		if(($scope.merchant.establishment_name !== "") || ($scope.merchant.person_name !== "") || ($scope.merchant.phone_number !== ""))
		{
			$http.post('/api/v1/beta/merchants', {establishment_name: $scope.merchant.establishment_name, 
												    person_name: $scope.merchant.person_name,
													phone_number: $scope.merchant.phone_number,
													email: $scope.merchant.email}).success(function(data, status, header, config){
				$scope.merchant.thank_you = true;
			}).error(function(data, status, header, config){
				$scope.merchant.error = true;
			});
		}
	}
}