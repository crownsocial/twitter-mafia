TwitterAnalytics.controller('NavCtrl', ['$scope', '$mdDialog', 'UserService', function($scope, $mdDialog, UserService){

  console.log('nav controller loaded (frontend)')

  $scope.showSignupModal = function(event) {
    console.log('signup modal fired off');
    $mdDialog.show({
      controller: 'modalCtrl',
      templateUrl: 'templates/modals/signupModal.html',
      targetEvent: event
    })
  }

  $scope.showLoginModal = function(event) {
    console.log('login modal fired off');
    $mdDialog.show({
      controller: 'modalCtrl',
      templateUrl: 'templates/modals/loginModal.html',
      targetEvent: event
    })
  }

  $scope.logout = function(){
    UserService.logout(function(err, data){
      console.log('user logged out', err, data)
    });
  }

}]);