TwitterMafia.controller('modalCtrl', ['$scope', '$rootScope', '$http', '$modalInstance', '$location', '$mdToast', function($scope, $rootScope, $http, $modalInstance, $location, $mdToast) {
  console.log('login modal loaded')

  // var passport = require('passport-twitter')

  $scope.login = function(provider, email, password){
    console.log(provider)
    if(provider === null) {
      console.log(email, password)
      $http.post('/auth/local/', {identifier: email, password:password}).success(function(data){
        console.log('user successfully logged in:', data)
        $rootScope.currentUser = data;
        $modalInstance.close({user: $rootScope.currentUser})
        $rootScope.showLoginToast();
        $location.path('/')
      })
    }
    else if (provider === 'twitter'){
      console.log('trying to log in with twitter')
      // $http.jsonp('/auth/twitter').success(function(tweeter){
      //   console.log(tweeter)
      // })
      location.href = '/auth/' + provider;
    }

  }

  $scope.signup = function(){
    console.log($scope.email, $scope.password)
    $http.post('/auth/local/register', {email: $scope.email, password:$scope.password}).success(function(user){
      console.log('user created', user)
      $rootScope.showSignupToast();
    })
  }

  // $scope.signup = function(){
  //   SignupService.signup($scope.email, $scope.password, function(err, data){
  //     if (err){
  //       console.log(err);
  //     }else if (data && data.password && data.email){
  //       console.log('you want to sign up with ' + $scope.email + ' and ' + $scope.password)
  //       console.log(data)
  //       $mdDialog.hide();
  //       $rootScope.showSignupToast();
  //     }else{
  //       console.log("user couldn't be created")
  //     }
  //   })
  // };

  // // $scope.login = function() {
  // //   UserService.login($scope.email, $scope.password, function(err, data) {
  // //     console.log(data)
  // //     if (err){
  // //       console.log(err);
  // //     } else if (data && data.result && data.user) {
  // //       console.log('you want to login with ' + $scope.email + ' and ' + $scope.password);
  // //       console.log('login status:', data);
  // //       $mdDialog.hide();
  // //       $rootScope.showLoginToast();
  // //     }else{
  // //       console.log("user couldn't be logged in.");
  // //     }
  // //   })
  // // };

  // $scope.login = function(provider, email, password){
  //   if(provider === null){
  //     $http.post('/auth/local', {email: email, password: password})
  //     .success(function(data){
  //       if(data.success === true){
  //         console.log('you want to login with ' + email + ' and ' + password);
  //         console.log('login status:', data);
  //         $mdDialog.hide();
  //         $rootScope.showLoginToast();
  //        }else{
  //         $rootScope.error = true;
  //        }
  //     })
  //     .error(function(data){
  //       console.log(data)
  //     })
  //   }else{
  //     location.href = '/auth/'+provider
  //     }
  //    };



  // $scope.cancel = function(){
  //   $mdDialog.cancel();
  // };

}]);