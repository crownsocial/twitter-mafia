// api/controllers/UserController.js

var CronJob = require('cron').CronJob;
var update = require('../helpers/updateData');
// var async = require('async')
var _ = require('lodash')


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

  updateInfluencers: function(req, res) {
    var influencers = req.body.influencers;
    console.log(influencers)
    Twitter_Account.find({user: req.session.user.id}).populate('influencers').exec(function(err, twitterAcc){
      console.log(twitterAcc)

      // {influencers: influencers}).populate('influencers').exec(function(err, twitterAcc){
      twitterAcc.influencers = influencers
      // twitterAcc.influencers.forEach(function(influencer) {
      //   influencer.twitter_account = twitterAcc.id
      //   influencer[0].save(function(err){console.log(err)})
      // })
      res.send({influencers: twitterAcc.influencers})
    })
  },

  retrieve: function(req, res) {
    console.log('inside of user retrieve function', req.session.user)
    async.auto({
      twitterAccount: function(callback){
        Twitter_Account.find({user: req.session.user.id}).populate('tweetCollections').exec(function(err, user){
          console.log('first cb:',user)
          callback(null, user[0])
        });
      },
      collectionTweets: ['twitterAccount', function(callback, twitterAccount){
        console.log('second cb:',twitterAccount)
        async.map(twitterAccount.twitterAccount.tweetCollections, function(tweetCollection, innercb){
          TweetCollection.find({id: tweetCollection.id}).populate('tweets').exec(function(err, data){
            console.log('inner cb:', data)
            innercb(null, data[0]);
          });
        }, function(err, results){
          callback(null, results)
        })
      }],
    }, function(err, result) {
      // console.log('err is:', err)
      // console.log('results: ', result)
      res.send(result)
    })
    // Twitter_Account.findOne({user: req.session.user.id}).populate('tweetCollections')
    // .then(function(twitterAcc) {
    //   var tweets = TweetCollection.find({
    //     tweets: _.pluck(twitterAcc.tweetCollections, 'tweets')
    //   })
    //   .then(function(tweets){
    //     console.log('retrieved tweets:', tweets)
    //     return tweets;
    //   });
    //   console.log('retrieved tweets (after promise) :', tweets)
    //   return [twitterAcc, tweets]
    // })
    // .spread(function(twitterAcc, tweets) {
    //   var tweets = _.indexBy(tweets, 'tweet_id');
    //   twitterAcc.tweetCollections = _.map(twitterAcc.tweetCollections, function(collection){
    //     collection.tweets = tweets[twitterAcc.tweetCollections];
    //     return collection;
    //   })
    //   res.json(twitterAcc)
    // })
    // .catch(function(err){
    //   if (err) {
    //     return res.send(err)
    //   }
    // })
  },

  update: function(req, res) {


    // var formatDates = function(entities) {
    //   if (!Array.isArray(entities)) {
    //     entities = [entities];
    //   }

    //   entities.forEach(function(entity) {

    //     // check http://momentjs.com/docs/#/displaying/
    //     entity.created_at = moment(Date.parse(entity.created_at)).format("D, M, YY, HHH, ddd");
    //     console.log(entity.created_at)
    //   });
    // }


    /*******************************************************************************
    * Testing methods for cron jobs
    * Delete at any time
    *******************************************************************************/
    // const TIMEZONE = 'America/Los_Angeles';
    // // logs a message every five seconds
    // new CronJob('*/5 * * * * *', function() {
    //   console.log(new Date(), 'You will see this message every 5 seconds.');
    // }, null, true, TIMEZONE);

    // // logs a message every minute
    // new CronJob('00 * * * * *', function() {
    //   console.log(new Date(), 'You will see this message every minute.');
    // }, null, true, TIMEZONE);

    // every ten seconds, this will make an API call and then email the result

    /*******************************************************************************
    * Alex comment
    *******************************************************************************/

    User.findOne({id: req.params.id}).then(function(user){
      console.log('user retrieve function', user)
      Passport.find({user: user.id}).then(function(passport){
        update.getMyUser({}, user.username, req, res)
      })
    })

    // CRON JOBS FOR INFLUENCERS, HASHTAGS, MENTIONS
    // Runs every 15 minutes

    new CronJob('* */15 * * * *', function() {
        client.get("users/show", {screen_name: "alexthephallus"}, function(error, data, response) {
        if (!error) {

          formatDates(data);
          sendEmail("alex@crownsocial.com", "Cron job message", "You should get this every ten seconds: " + JSON.stringify(data));
        } else {
          console.log("Error:", error);
        }
      });
    }, null, true, 'America/Los_Angeles');

  }
};
