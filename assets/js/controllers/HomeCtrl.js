TwitterMafia.controller('HomeCtrl', ['$scope', '$rootScope', '$http', '$mdToast', function($scope, $rootScope, $http, $mdToast){

  console.log('home controller loaded (frontend)', $rootScope.currentUser)

  $scope.loaded = false;

  // data for line graph

  $scope.lineLabels = ['July'];
  $scope.lineSeries = ['total followers', 'engagements per post'];
  $scope.lineOptions = [{
    fillColor: "rgba(128, 128, 128, 0.4)",
    strokeColor: "rgba(128, 128, 128, 0.8)",
    highlightFill: "rgba(228, 135, 27, 0.75)",
    highlightStroke: "rgba(228, 135, 27, 1)"
  }]
  $scope.lineData = [[212],[61]]; // user followers counts and engagements count

  // data for bar graph

  $scope.barLabels = ['July'];
  $scope.barSeries = ['total tweets'];
  $scope.barData = [[524]];

  // data for donut chart
  $scope.donutLabels = ['replies', 'retweets', 'links', 'hashtags']
  $scope.donutData = [125, 100, 50, 75]

  $scope.onClick = function (points, evt) {
    console.log(points, evt);
  };

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
    // $scope.twitterPassports = [];
    console.log('get user ran')
    $http.get('/api/user/' + $rootScope.currentUser.id).success(function(user){
      console.log('get user success', user)
      $scope.user = user;
      $scope.loaded = true;

      console.log('statuses count:', $scope.user.myUser.statuses_count);
      console.log('followers count:', $scope.user.myUser.followers_count);

      // $scope.overlayData = {
      //     $scope.lineLabels: ["July"],
      //     $scope.lineDatasets: [
      //       {
      //         label: "total followers",
      //         type: "bar",
      //         fillColor: "rgba(128, 128, 128, 0.4)",
      //         strokeColor: "rgba(128, 128, 128, 0.8)",
      //         highlightFill: "rgba(228, 135, 27, 0.75)",
      //         highlightStroke: "rgba(228, 135, 27, 1)",
      //         data: [$scope.user.myUser.followers_count]
      //       },
      //       {
      //         label: "engagements per post",
      //         type: "line",
      //         fillColor: "rgba(192, 192, 192,0.4)",
      //         strokeColor: "rgba(192, 192, 192,0.8)",
      //         pointColor: "rgba(192, 192, 192,1)",
      //         pointStrokeColor: "#fff",
      //         pointHighlightFill: "#fff",
      //         pointHighlightStroke: "rgba(110,110,110,1)",
      //         data: [65]
      //       }
      //     ]
      //   };

      //   $scope.barData = {
      //     labels: ["July"],
      //     datasets: [
      //       {
      //         label: "total tweets",
      //         fillColor: "rgba(160, 160, 160, 0.4)",
      //         strokeColor: "rgba(160, 160, 160, 0.8)",
      //         highlightFill: "rgba(228, 135, 27, 0.75)",
      //         highlightStroke: "rgba(228, 135, 27, 1)",
      //         data: [$scope.user.myUser.statuses_count]
      //       }
      //     ]
      //   };

      //   $scope.doughnutData = [
      //     {
      //       value: 125,
      //       color:"rgb(96, 96, 96)",
      //       highlight: "rgb(228, 135, 27)",
      //       label: "replies"
      //     },
      //     {
      //       value: 100,
      //       color: "rgb(160, 160, 160)",
      //       highlight: "rgb(228, 135, 27)",
      //       label: "retweets"
      //     },
      //     {
      //       value: 50,
      //       color: "rgb(128, 128, 128)",
      //       highlight: "rgb(228, 135, 27)",
      //       label: "links"
      //     },
      //     {
      //       value: 75,
      //       color: "rgb(192, 192, 192)",
      //       highlight: "rgb(228, 135, 27)",
      //       label: "hashtags"
      //     }
      //   ]
    })
  }

  if($rootScope.currentUser){
    $scope.getUser();
  }

  L.mapbox.accessToken = 'pk.eyJ1IjoiYmVubmV0dHNsaW4iLCJhIjoiYzU0V200YyJ9._G57JU3841MTuFULQD9pVg';
  var map = L.mapbox.map('map', 'bennettslin.lnp05233')
            .setView([47.6244, -122.3317], 11);
  map.scrollWheelZoom.disable();

  $scope.login = function(provider, email, password){
    console.log('trying twitter auth')
    if (provider === 'twitter'){
      location.href = '/auth/twitter';
    }
  }

}]);