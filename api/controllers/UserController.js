// api/controllers/UserController.js

var twitter = require('twitter');
var moment = require("moment");
var client = new twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

module.exports = {

  index: function(req, res){
    User.find().then(function(users) {
      res.send(users);
    });
  },

  create: function(req, res) {
    console.log(req.body.email, req.body.password);
    User.create({email: req.body.email, password: req.body.password}).then(function(user) {
      res.send(user);
    });
  },

  retrieve: function(req, res) {

    var formatDates = function(entities) {
      if (!Array.isArray(entities)) {
        entities = [entities];
      }

      entities.forEach(function(entity) {

        // check http://momentjs.com/docs/#/displaying/
        entity.created_at = moment(entity.created_at).format("ddd MMM Do YY, h:mma");
      });
    }

    var getHashtagPosts = function(object, hashtags, res) {
      var hashtagPosts = [];
      async.each(hashtags, function(hashtag, callback) {
        client.get("search/tweets", {q: "#" + hashtag}, function(error, data, response) {
          if (!error) {
            formatDates(data.statuses);
            hashtagPosts.push(data.statuses);
            callback();
          } else {
            callback(error);
          }
        })
      }, function(error) {
        if (!error) {
          object.hashtags = hashtags;
          object.hashtagPosts = hashtagPosts;
          res.send(object);
        } else {
          res.send("Error:", error);
        }
      })
    }

    var getInfluencers = function(object, influencers, res) {
      var params = {screen_name: influencers.join(",")};
      client.get("users/lookup", params, function(error, data, response) {
        if (!error) {
          formatDates(data);
          object.influencers = data;
          var hashtags = ['socialmedia', 'inclusivedesign', 'technology'];
          getHashtagPosts(object, hashtags, res);
        } else {
          res.send("Error:", error);
        }
      })
    }

    var getMyTweets = function(object, user_id, res) {
      var params = {user_id: user_id, count: 200, include_rts: 1}
      client.get("statuses/user_timeline", params, function (error, data, response) {
        if (!error) {
          formatDates(data);
          object.myTweets = data;
          var influencers = ['MicrosoftDesign', 'EMCcorp', 'CrownSocial'];
          getInfluencers(object, influencers, res);
        } else {
          res.send("Error:", error);
        }
      });
    }

    var getMyFollowers = function(object, user_id, res) {
      var params = {user_id: user_id}
      client.get("followers/ids", params, function (error, data, response) {
        if (!error) {

          var ids = data.ids; // array of user ids

          // separate lists of a hundred, at most 10 for now
          // each list is a single string of user ids separated by comma
          var listsOf100 = [];
          while (listsOf100.length < 10 && ids.length > 0) {
            var listString = ids.splice(0, 100).join(",");
            listsOf100.push(listString);
          }

          // call Twitter API, 100 followers at a time
          var followers = [];
          async.each(listsOf100, function(listString, callback) {

            var params = {user_id: listString};
            client.get("users/lookup", params, function(error, data, response) {
              if (!error) {

                // success
                formatDates(data);
                followers = followers.concat(data);
                callback();

              } else {
                callback(error);
              }
            })

          }, function(error) {

            if (!error) {

              // add remaining ids
              var remainingIds = ids.map(function(id) {
                return { id_str: id, status: { id_str: "" } };
              })
              followers = followers.concat(remainingIds);
              object.myFollowers = followers;
              getMyTweets(object, user_id, res);

            } else {
              res.send("Error:", error);
            }

          })
        } else {
          res.send("Error:", error);
        }
      });
    }

    var getMyUser = function(object, username, res) {
      var params;
      if (isNaN(parseInt(username))) {
        params = {screen_name: username};
      } else {
        params = {user_id: username};
      }
      client.get("users/show", params, function(error, data, response) {

        if (!error) {
          object.myUser = data;
          getMyFollowers(object, data.id_str, res);
        } else {
          res.send("Error:", error);
        }
      });
    }

    User.findOne({id: req.params.id}).then(function(user){
      // getMyUser({}, username, res)
      console.log('user retrieve function', user)
      Passport.find({user: user.id}).then(function(passport){
        getMyUser({}, user.username, res)
      })
    })
  }

  // create: function(req, res){
  //   User.create({email: req.params.email ...})
  // }

};
