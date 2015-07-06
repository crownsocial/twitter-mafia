TwitterAnalytics.factory('SignupService', ['$http', function($http) {
  return {
    signup: function(email, password, callback){
      console.log('making post to signup: ', email, password)
      var self = this;
      $http.post('/api/user/', {email: email, password: password})
      .success(function(data){
        console.log(data)
        if(data && data.password && data.email){
          self.currentUser = data.user;
        }else{
          self.currentUser = false;
        }
        callback(null, data);
      })
      .error(function(err){
        callback(err)
      });
    }
  }
}]);