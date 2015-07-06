TwitterAnalytics.controller('modalCtrl', ['$scope', '$rootScope', '$mdDialog', 'SignupService', function($scope, $rootScope, $mdDialog, SignupService) {
  console.log('login modal loaded')

  $scope.signup = function(){
    SignupService.signup($scope.email, $scope.password, function(err, data){
      if (err){
        console.log(err);
      }else if (data && data.password && data.email){
        console.log('you want to sign up with ' + $scope.email + ' and ' + $scope.password)
        console.log(data)
        $mdDialog.hide();
        $rootScope.showSignupToast();
      }else{
        console.log("user couldn't be created")
      }
    })
  };
  $scope.cancel = function(){
    $mdDialog.cancel();
  };
}]);