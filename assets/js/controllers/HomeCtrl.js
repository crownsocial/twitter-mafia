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

  // function that hits a route which fires off API call to update user.
  $scope.updateUser = function() {
    // $scope.twitterPassports = [];
    console.log('get user ran')
    $http.get('/api/user/' + $rootScope.currentUser.id + '/update/').success(function(user){
      console.log('get user success', user)
      $scope.user = user;
      $scope.loaded = true;
    })
  }

  // function that hits a route to retrieve locally stored User info.
  $scope.retrieveUser = function() {
    // $scope.twitterPassports = [];
    console.log('get user ran')
    $http.get('/api/user/' + $rootScope.currentUser.id).success(function(user){
      console.log('get user success', user)
      $scope.user = user;
      $scope.loaded = true;
    })
  }

  $scope.saveInfluencers = function() {
    console.log($scope.influencers);
    $http.post('/api/user/' + $rootScope.currentUser.id + '/influencers', {influencers: $scope.influencers}).success(function(influencers) {
      console.log('user influencers updated', influencers)
      $scope.influencers = influencers
      $scope.influencerInitialised = true;
      $scope.retrieveUser();
    })
  }

  if (!$rootScope.currentUser || !$rootScope.currentUser.influencers) {
    console.log('no influencers')
    $scope.influencerInitialised = false;
    $scope.influencers = [{screen_name: null}, {screen_name: null}, {screen_name: null}]
  }else if (!$rootScope.currentUser.hashtagPosts) {
    $scope.hashtagPosts;
  }

  if($rootScope.currentUser){
    // $scope.updateUser();
    $scope.retrieveUser();
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