TwitterAnalytics.factory('UserService', ['$http', function($http){
  return {
    login: function(email, password, callback){
      var self = this;
      $http.post('/auth', {email: email, password: password})
        .success(function(data){
          console.log(data)
          if(data && data.result && data.user){
            console.log('user sign in')
            self.currentUser = data.user;
          }else{
            self.currentUser = false;
          }
          self.check(function(){
            console.log('check ran after login')
          });
          callback(null, data);
        })
        .error(function(err){
          callback(err)
        });
    },
    check: function(callback){
      var self = this;
      $http.get('/auth').success(function(data){
          if(data && data.user){
            self.currentUser = data.user;
          }else{
            self.currentUser = false;
          }
          callback(null, data);
      })
    },
    logout: function(callback){
      this.currentUser = false;
      $http.delete('/auth')
      .success(function(data){
        callback(null, data)
      })
      .error(function(err){
        callback(err)
      })
    }
  };
}])
.factory('Users', ['$resource', function($resource){
  return $resource('/api/user/:id')
}])