// api/controllers/UserController.js

var twitter = require('twitter');
var moment = require("moment");
var client = new twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var formatDates = function(entities) {
  if (!Array.isArray(entities)) {
    entities = [entities];
  }

  entities.forEach(function(entity) {

    // check http://momentjs.com/docs/#/displaying/
    entity.created_at = moment(entity.created_at).format("ddd MMM Do YY, h:mma");
  });
}

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
    User.findOne({id: req.params.id}).then(function(user){
      console.log('user retrieve function', user)
      Passport.find({user: user.id}).then(function(passport){
        var params = {screen_name: user.username}
        client.get("users/show", params, function(error, data, response) {
          if (!error) {
            console.log(data);
            formatDates(data);
            res.send({twitter_account: data});
          } else {
            res.send("Error:", error);
          }
        });
      })
    })
  }

  // create: function(req, res){
  //   User.create({email: req.params.email ...})
  // }

};
