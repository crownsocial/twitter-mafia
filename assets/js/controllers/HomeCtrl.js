TwitterMafia.controller('HomeCtrl', ['$scope', '$rootScope', '$http', '$mdToast', function($scope, $rootScope, $http, $mdToast){

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

  $rootScope.showGenericToast = function(msg) {
    $mdToast.show(
      $mdToast.simple()
        .content(msg)
        .position($scope.getToastPosition())
        .hideDelay(3000)
    );
  }

  $scope.getUser = function() {
    $scope.twitterPassports = [];
    console.log('get user ran')
    $http.get('/api/user/' + $rootScope.currentUser.id).success(function(user){
      console.log('get user success')
      $scope.user = user
      console.log('user object:', $scope.user)
      console.log($scope.twitterPassports, $scope.user.passports)
      $scope.getTwitterAccounts = function() {
        $scope.user.passports.map(function(passport){
          if (passport.protocol == 'twitter') {
            $scope.twitterPassports.push(passport)
          }
        })
      }
    })
  }

  if($rootScope.currentUser){
    $scope.getUser();
  }

  $scope.login = function(provider, email, password){
    console.log('trying twitter auth')
    if (provider === 'twitter'){
      location.href = '/connect/' + provider;
    }
  }

}]);