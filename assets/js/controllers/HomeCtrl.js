TwitterMafia.controller('HomeCtrl', ['$scope', '$rootScope', '$http', '$mdToast', function($scope, $rootScope, $http, $mdToast){

  console.log('home controller loaded (frontend)', $rootScope.currentUser)

  $scope.loaded = false;

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

  $scope.overlayData = {
    labels: ["July"],
    datasets: [
      {
        label: "total followers",
        type: "bar",
        fillColor: "rgba(128, 128, 128, 0.4)",
        strokeColor: "rgba(128, 128, 128, 0.8)",
        highlightFill: "rgba(228, 135, 27, 0.75)",
        highlightStroke: "rgba(228, 135, 27, 1)",
        data: [$scope.followers_count]
      },
      {
        label: "engagements per post",
        type: "line",
        fillColor: "rgba(192, 192, 192,0.4)",
        strokeColor: "rgba(192, 192, 192,0.8)",
        pointColor: "rgba(192, 192, 192,1)",
        pointStrokeColor: "#fff",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(110,110,110,1)",
        data: [65]
      }
    ]
  };

  $scope.barData = {
    labels: ["July"],
    datasets: [
      {
        label: "total tweets",
        fillColor: "rgba(160, 160, 160, 0.4)",
        strokeColor: "rgba(160, 160, 160, 0.8)",
        highlightFill: "rgba(228, 135, 27, 0.75)",
        highlightStroke: "rgba(228, 135, 27, 1)",
        data: [$scope.tweets_count]
      }
    ]
  };

  $scope.doughnutData = [
    {
      value: 125,
      color:"rgb(96, 96, 96)",
      highlight: "rgb(228, 135, 27)",
      label: "replies"
    },
    {
      value: 100,
      color: "rgb(160, 160, 160)",
      highlight: "rgb(228, 135, 27)",
      label: "retweets"
    },
    {
      value: 50,
      color: "rgb(128, 128, 128)",
      highlight: "rgb(228, 135, 27)",
      label: "links"
    },
    {
      value: 75,
      color: "rgb(192, 192, 192)",
      highlight: "rgb(228, 135, 27)",
      label: "hashtags"
    }
  ]
    // $scope.twitterPassports = [];
    console.log('get user ran')
    $http.get('/api/user/' + $rootScope.currentUser.id).success(function(user){
      console.log('get user success', user)
      $scope.user = user;
      $scope.loaded = true;

      console.log('statuses count:', $scope.user.myUser.statuses_count);
      console.log('followers count:', $scope.user.myUser.followers_count);

      addEventListener('load', load, false);

        function load(){
          $scope.overlayCtx = document.getElementById("overlay-chart").getContext("2d");
          $scope.overlayChart = new Chart(overlayCtx).Overlay($scope.overlayData);

          $scope.barCtx = document.getElementById("bar-chart").getContext("2d");
          $scope.barChart = new Chart(barCtx).Bar($scope.barData);

          $scope.doughnutCtx = document.getElementById("doughnut-chart").getContext("2d");
          $scope.doughnutChart = new Chart(doughnutCtx).Doughnut($scope.doughnutData);
        }


      // $scope.user = user.twitter_account
      // $scope.followerscount = $scope.user.followers_count;
      // console.log($scope.followerscount)
      // console.log('user object:', $scope.user)
      // console.log($scope.twitterPassports, $scope.user.passports)
      // $scope.getTwitterAccounts = function() {
      //   $scope.user.passports.map(function(passport){
      //     if (passport.protocol == 'twitter') {
      //       $scope.twitterPassports.push(passport)
      //     }
      //   })
      // }
    })
  }

  if($rootScope.currentUser){
    $scope.getUser();
  }

  $scope.login = function(provider, email, password){
    console.log('trying twitter auth')
    if (provider === 'twitter'){
      location.href = '/auth/twitter';
    }
  }

}]);