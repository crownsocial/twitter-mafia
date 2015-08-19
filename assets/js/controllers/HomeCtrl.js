TwitterMafia.controller('HomeCtrl', ['$scope', '$rootScope', '$http', '$mdToast', function($scope, $rootScope, $http, $mdToast){

  console.log('home controller loaded (frontend)', $rootScope.currentUser)

  $scope.loaded = false;

  // data for graph
  $scope.polygons = []

  var graphData = {dataSet: [], max:null,min:null}

  for(var j = 0; j < 30; j++) {
    // console.log(graphData.dataSet);
    var x = Math.ceil(Math.random() * 200);
    var z = Math.ceil(Math.random() * 40);
    if(j > 0) {
      z += graphData.dataSet[j-1].z;
    }

    if(graphData.min === null || x < graphData.min) {
      graphData.min = x;
    }
    if(z < graphData.min) {
      graphData.min = z;
    }
    if(graphData.max === null || x > graphData.max) {
      graphData.max = x;
    }
    if(z > graphData.max) {
      graphData.max = z;
    }
    graphData.dataSet.push({x:x,z:z});
  }

  console.log("graphData:",graphData)

  var dataLength = graphData.dataSet.length;
  var scale = 150/(graphData.max - graphData.min);

  for(var i = dataLength - 1; i >= 0; i--) {
    $scope.polygons.push(calcPolygon(graphData.dataSet[i], i, dataLength, scale))
  }

  function calcPolygon(data, i, len, scale) {
    var x = data.x * scale, y = 10, z = data.z * scale;
    var origin, a, b, c, p;

    const THETA = 60*Math.PI/180;
    const PHI = 30*Math.PI/180;

    origin = {x: 0, y:0};
    a = {x: -x*Math.cos(THETA), y: -x*Math.sin(THETA)};
    b = {x: y*Math.cos(PHI), y: -y*Math.sin(PHI)};
    c = {x: a.x + b.x, y: (a.y + b.y)};
    p = {x: c.x, y:c.y + z};

    var polygons = {
        front: [point(a), point(a,z), point(p), point(c)],
        top: [point(a,z), point(origin,z), point(b,z), point(p)],
        side: [point(p), point(b,z), point(b), point(c)],
        midpoint: {x: a.x/2, y: a.y/2},
        offset: {x: (350 - (len * 10)) + ((len - i) * 10), y: (350 - (len * 5)) + ((len - i) * 5)}
    };

    return polygons
  }

  function point(point, y) {
    y = y || 0;
    return {x: point.x, y: point.y + y}
  }

  $scope.parsePoints = function(points, offset) {
    if(Array.isArray(points)) {
        return points.map(function(point) {
            return (point.x + offset.x) + ',' + (-point.y + offset.y);
        }).join(' ');
    } else {
        return (points.x + offset.x) + ',' + (-points.y + offset.y)
    }
  }

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
      // $scope.user = user;
      // $scope.loaded = true;
    })
  }

  var separateTrackers = function(type){
    type.forEach(function(trackerType){
      console.log("Tracker type:",trackerType)
      if($scope.user.trackers) {
        $scope.user[trackerType] = $scope.user.trackers.filter(function(tracker){
          return (tracker.type == trackerType.toString())
        });
      }
    });
  }

  // function that hits a route to retrieve locally stored User info.
  $scope.retrieveUser = function() {
    // $scope.twitterPassports = [];
    console.log('get user ran')
    $http.get('/api/user/' + $rootScope.currentUser.id).success(function(user){
      console.log('get user success', user)
      $scope.user = user;
      $scope.loaded = true;
      $scope.settings.email = user.user.email || '';
      $scope.settings.emailToggle = user.user.emailToggle || false;

      separateTrackers(['influencer', 'hashtag', 'mention']);

      var enableAddTrackers = function(type) {
        type.forEach(function(trackerType){
          // if ($scope.user[trackerType].length < 3){
          //   $scope.user[trackerType].addable = true;
          //   $scope.user[trackerType].addLength = new Array(3-$scope.user[trackerType].length);
          // }
          $scope.user[trackerType].addable = true;
          $scope.user[trackerType].addLength = new Array(1)// + $scope.user[trackerType].length;
        })
      }

      enableAddTrackers(['influencer', 'hashtag', 'mention'])
    });
  }

  $scope.saveInfluencers = function(influencer) {
    if(influencer) {

    }
    $http.post('/api/user/' + $rootScope.currentUser.id + '/influencer', {influencer: influencer}).success(function(influencers) {
      console.log('user influencers updated', influencers)
      $scope.influencers = influencers
      $scope.influencerInitialised = true;
      $scope.retrieveUser();
    })
  }

  $scope.createTracker = function(tracker, type){
    if(tracker) {
      console.log(tracker)
      $http.post('/api/user/' + $rootScope.currentUser.id + '/' + type, {tracker: tracker}).success(function(trackers) {
        console.log('user trackers updated', trackers)
        // $scope.hashtags = hashtags
        if(type == 'influencer') {
          $scope.user.influencer.push(trackers.addedInfluencer);
          $scope.influencerInitialised = true;
        } else if(type == 'hashtag') {
          $scope.user.hashtag.push(trackers.addedHastag);
        } else if(type == 'mention') {
          $scope.user.mention.push(trackers.addedMention);
        }
        // $scope.retrieveUser();
      })
    }
  }

  $scope.removeTracker = function(tracker) {
    console.log("Removing ",tracker,"from your trackers.");
    if(tracker) {
      $http.delete('/api/user/' + $rootScope.currentUser.id + '/tracker/' + tracker).success(function(trackers) {
        // $scope.user.trackers = trackers;
        separateTrackers(['influencer', 'hashtag', 'mention'])
        console.log("Tracker removed");
      });
    }
  }

  // if (!$scope.user || !$scope.user.influencers) {
  //   console.log('no influencers')
  //   $scope.influencerInitialised = false;
  //   $scope.influencers = [{screen_name: null}, {screen_name: null}, {screen_name: null}]
  // }else if (!$rootScope.currentUser.hashtagPosts) {
  //   $scope.hashtagPosts;
  // }

  if($rootScope.currentUser){
    $scope.settings = {emailToggle: $rootScope.currentUser.emailToggle || false, email: $rootScope.currentUser.email || ''}
    // $scope.updateUser();
    $scope.retrieveUser();
  } else {
    $scope.settings = {emailToggle: false, email: ''}
  }
  console.log($scope.email)

  $scope.updateNotify = function() {
    console.log('toggle change',$scope.settings.emailToggle);
    $http.post('/api/user/email/notify', {emailToggle: $scope.settings.emailToggle}).success(function(value) {
      if(!value) {
        console.log('could not update email notification settings.');
        // $scope.emailToggle = oldVal;
      }
    });
  }

  $scope.updateEmail = function() {
    if($scope.settings.email !== '') {
      $http.post('/api/user/email/update', {email: $scope.settings.email}).success(function(response) {
        if(!response) {
          console.log('Could not udpate your email address.');
          $scope.settings.email = response || '';
        }
      })
    }
  }

  // L.mapbox.accessToken = 'pk.eyJ1IjoiYmVubmV0dHNsaW4iLCJhIjoiYzU0V200YyJ9._G57JU3841MTuFULQD9pVg';
  // var map = L.mapbox.map('map', 'bennettslin.lnp05233')
  //           .setView([47.6244, -122.3317], 11);
  // map.scrollWheelZoom.disable();

  $scope.login = function(provider, email, password){
    console.log('trying twitter auth')
    if (provider === 'twitter'){
      location.href = '/auth/twitter';
    }
  }

}]);