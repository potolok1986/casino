casino.directive("drChecked", [function () {
	return{
		templateUrl:"directives/drChecked.html",
		scope:{
			model:"=ngModel",
			title:"=",
			min:"@"
		},
		restrict:"C",
		link: function postLink($scope) {
			console.log($scope);
			$scope.min = $scope.min || 0;
			$scope.add = function () {
				$scope.model++;
			};
			$scope.remove = function () {
				$scope.model = ($scope.model <= $scope.min ) ? $scope.min : --$scope.model;
			}
		}
	}
}]);
