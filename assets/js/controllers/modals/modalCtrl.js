TwitterAnalytics.controller('modalCtrl', ['$scope', '$mdDialog', 'SignupService', function($scope, $mdDialog, SignupService) {
  console.log('login modal loaded')

  $scope.signup = function(){
    SignupService.signup($scope.email, $scope.password, function(err, data){
      if (err){
        console.log(err);
      }else if (data && data.password && data.email){
        console.log('you want to sign up with ' + $scope.email + ' and ' + $scope.password)
        console.log(data)
        $mdDialog.hide();
      }else{
        console.log("user couldn't be created")
      }
    })
  };

  $scope.cancel = function(){
    $mdDialog.cancel();
  };
}]);