TwitterAnalytics.controller('HomeCtrl', ['$scope', '$rootScope', '$mdToast', '$http', 'UserService', function($scope, $rootScope, $mdToast, $http, UserService){

  console.log('home controller loaded (frontend)')

  $scope.toastPosition = {
    bottom: true,
    top: false,
    left: false,
    right: true
  };

  $scope.getToastPosition = function() {
    return Object.keys($scope.toastPosition)
      .filter(function(pos) { return $scope.toastPosition[pos]; })
      .join(' ');
  };

  $rootScope.showSignupToast = function() {
    $mdToast.show(
      $mdToast.simple()
        .content('User successfully created! Please sign in.')
        .position($scope.getToastPosition())
        .hideDelay(3000)
    );
  };

  $rootScope.showLoginToast = function() {
    $mdToast.show(
      $mdToast.simple()
        .content('User successfully logged in!')
        .position($scope.getToastPosition())
        .hideDelay(3000)
    );
  };

  $scope.getUser = function() {
    console.log('get user ran')
    $http.get('/api/user/' + $rootScope.currentUser.id).success(function(user){
      console.log('get user success')
      $scope.user = user
      console.log('user object:', $scope.user)
    })
  }

  $scope.getUser();

}]);