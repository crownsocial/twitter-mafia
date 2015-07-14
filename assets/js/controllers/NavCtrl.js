TwitterMafia.controller('NavCtrl', ['$scope', '$modal', '$location', 'smoothScroll', function($scope, $modal, $location, smoothScroll){

  console.log('nav controller loaded (frontend)')

  $scope.showSignupModal = function() {
    console.log('signup modal fired off');
    $modal.open({
      controller: 'modalCtrl',
      templateUrl: 'templates/modals/signupModal.html',
      size: 'lg',
      resolve: {
        user: function(){
          return $scope.user
        }
      }
    })
  }

  $scope.showLoginModal = function(event) {
    console.log('login modal fired off');
    $modal.open({
      controller: 'modalCtrl',
      templateUrl: 'templates/modals/loginModal.html',
      size: 'lg',
      resolve: {
        user: function(){
          return $scope.user
        }
      }
    })
  }

  $scope.cancel = function() {
    $modal.close();
  }

  $scope.scrollTo = function(elem) {
    var element = document.getElementById(elem)

    var options = {
      duration: 700,
      easing: 'easeInQuad',
      offset: 120,
      callbackBefore: function(element) {
          console.log('about to scroll to element', element);
      },
      callbackAfter: function(element) {
          console.log('scrolled to element', element);
      }
    }
    smoothScroll(element, options)
  }
  // $scope.logout = function(){
  //   UserService.logout(function(err, data){
  //     console.log('user logged out', err, data)
  //   });
  // }

}]);