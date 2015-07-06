TwitterAnalytics.factory('SignupService', ['$http', function($http) {
  return {

    signup: function(email, password, callback){
      console.log('making post to signup: ', email, password)
      var self = this;
      $http.post('/api/user', {email: email, password: password})
      .success(function(data){
        console.log(data)
        if(data && data.password && data.username){
          self.currentUser = data.user;
        }else{
          self.currentUser = false;
        }
        callback(null, data);
      })
      .error(function(err){
        callback(err)
      });
    },

    login: function(email, password, callback) {
      var self = this;
      $http.post('/auth/local', {email: email, password: password})
      .success(function(data){
        if(data && data.result && data.user){
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