TwitterAnalytics.controller('modalCtrl', ['$scope', '$rootScope', '$mdDialog', 'SignupService', 'UserService', function($scope, $rootScope, $mdDialog, SignupService, UserService) {
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

  $scope.login = function() {
    UserService.login($scope.email, $scope.password, function(err, data) {
      console.log(data)
      if (err){
        console.log(err);
      } else if (data && data.result && data.user) {
        console.log('you want to login with ' + $scope.email + ' and ' + $scope.password);
        console.log('login status:', data);
        $mdDialog.hide();
        $rootScope.showLoginToast();
      }else{
        console.log("user couldn't be logged in.");
      }
    })
  }

  $scope.cancel = function(){
    $mdDialog.cancel();
  };

}]);