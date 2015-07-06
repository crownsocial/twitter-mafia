TwitterAnalytics.controller('NavCtrl', ['$scope', '$mdDialog', function($scope, $mdDialog){

  console.log('nav controller loaded (frontend)')

  $scope.showLoginModal = function(event){
    console.log('signup modal fired off')
    $mdDialog.show({
      controller: 'modalCtrl',
      templateUrl: 'templates/modals/signupModal.html',
      targetEvent: event
    })
  }

}]);