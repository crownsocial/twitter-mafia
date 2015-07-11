TwitterMafia.controller('NavCtrl', ['$scope', '$modal', function($scope, $modal){

  console.log('nav controller loaded (frontend)')

  $scope.showSignupModal = function() {
    console.log('signup modal fired off');
    $modal.open({
      controller: 'modalCtrl',
      templateUrl: 'templates/modals/signupModal.html',
      size: 'lg'
    })
  }

  $scope.showLoginModal = function(event) {
    console.log('login modal fired off');
    $modal.open({
      controller: 'modalCtrl',
      templateUrl: 'templates/modals/loginModal.html',
      size: 'lg'
    })
  }

  // $scope.logout = function(){
  //   UserService.logout(function(err, data){
  //     console.log('user logged out', err, data)
  //   });
  // }

}]);