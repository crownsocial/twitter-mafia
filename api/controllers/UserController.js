// api/controllers/UserController.js

var CronJob = require('cron').CronJob;
var update = require('../helpers/updateData');
// var async = require('async')
var _ = require('lodash')
var twitter = require('twitter');
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

  updateTracker: function(req, res) {
    var trackerType = req.params.tracker;

    if(trackerType == 'influencer') {
      var influencer = req.body.tracker;
      console.log('sent influencers:', influencer)
      console.log('user id:', req.session.user.id)
      Twitter_Account.findOne({user: req.session.user.id}).populate('trackers').exec(function(err, twitterAcc){
        console.log('found twitter account:', twitterAcc)
        Tracker.findOrCreate({name: influencer, type:'influencer'}, {name: influencer, type: 'influencer', twitter_accounts: twitterAcc.id}).exec(function(err, addedInfluencer){
          if(!("twitter_id" in addedInfluencer) || !addedInfluencer.twitter_id) {
            console.log("\n\n&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&\nGet influencer's twitter id")
            client.get("users/lookup", {screen_name: addedInfluencer.name}, function(err, data, response) {
              addedInfluencer.twitter_id = data[0].id_str;
              console.log("Found twitter id:",data[0].id_str);
              addedInfluencer.save();
              console.log('added influencer:', addedInfluencer);
              console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&\n\n");
              if (!Array.isArray(twitterAcc.trackers)) {
                twitterAcc.trackers = [];
              }
              twitterAcc.trackers.add(addedInfluencer);
              twitterAcc.save();
              res.send({addedInfluencer: addedInfluencer, trackers: twitterAcc.trackers})
            });
          } else {
            console.log('added influencer:', addedInfluencer)
            if (!Array.isArray(twitterAcc.trackers)) {
              twitterAcc.trackers = [];
            }
            twitterAcc.trackers.add(addedInfluencer);
            twitterAcc.save();
            res.send({addedInfluencer: addedInfluencer, trackers: twitterAcc.trackers})
          }
        })
      })
    }
    else if (trackerType == 'hashtag') {
      var hashtag = req.body.tracker;
      console.log('sent hashtag:', hashtag)
      console.log('user id:', req.session.user.id)
      Twitter_Account.findOne({user: req.session.user.id}).populate('trackers').exec(function(err, twitterAcc){
        // console.log('found twitter account:', twitterAcc)
        Tracker.findOrCreate({name: hashtag, type:'hashtag'}, {name: hashtag, type: 'hashtag', twitter_accounts: twitterAcc.id}).exec(function(err, addedHashtag){
          console.log('added hashtag:', addedHashtag)
          if (!Array.isArray(twitterAcc.trackers)) {
            twitterAcc.trackers = [];
          }
          twitterAcc.trackers.add(addedHashtag);
          twitterAcc.save();
          res.send({addedHashtag: addedHashtag, trackers: twitterAcc.trackers})
        })
      })
    } else if (trackerType == 'mention') {
      var mention = req.body.tracker;
      console.log('sent mention:',mention);
      console.log('user id:',req.session.user.id)
      Twitter_Account.findOne({user: req.session.user.id}).populate('trackers').exec(function(err, twitterAcc) {
        // console.log('found twitter account:',twitterAcc)
        Tracker.findOrCreate({name: mention, type:'mention'}, {name: mention, type: 'mention', twitter_accounts: twitterAcc.id}).exec(function(err, addedMention) {
            console.log("\n\n&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&\n");
          console.log('added mention:', addedMention);
            console.log("\n&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&\n\n");
          if(!Array.isArray(twitterAcc.trackers)) {
            twitterAcc.trackers = [];
          }
          twitterAcc.trackers.add(addedMention);
          twitterAcc.save();
          res.send({addedMention:addedMention, trackers: twitterAcc.trackers})
        })
      })
    }
  },

  deleteTracker: function(req, res) {
    var tracker = req.params.tracker;
    Twitter_Account.findOne({user: req.session.user.id}).populate('trackers').exec(function(err, account) {
      if(!err) {
        for(var i = 0; i < account.trackers.length; i++) {
          if(account.trackers[i].id === req.params.tracker) {
            account.trackers.remove(account.trackers[i].id);
            account.save();
            break;
          }
        }
        res.send(account.trackers);
      } else {
        console.log("ERROR:",err);
        res.send(err);
      }
    });
  },

  emailToggle: function(req, res) {
    User.findOne({id: req.session.user.id}).exec(function(err, user) {
      if(err) {
        console.log('\n*****************************************************************\n** Email Toggle failed\n*****************************************************************\n')
        res.send(false);
      } else {
        console.log('\n*****************************************************************\n** Email Toggle set'+req.body.emailToggle+'\n*****************************************************************\n')
        user.emailToggle = req.body.emailToggle;
        user.save();
        res.send(true);
      }
    });
  },

  emailUpdate: function(req, res) {
    User.findOne({id: req.session.user.id}).exec(function(err, user) {
      if(err) {
        console.log('\n*****************************************************************\n** Email update failed\n*****************************************************************\n')
        res.send(false);
      } else {
        console.log('\n*****************************************************************\n** Email update set\n*****************************************************************\n')
        user.email = req.body.email;
        user.save();
        res.send(user.email);
      }
    });
  },


  retrieve: function(req, res) {
    console.log('inside of user retrieve function', req.session.user)
    Twitter_Account.findOne({user: req.session.user.id}).populateAll().exec(function(err, user){
      console.log('User found:',user)
      res.send(user);
    });
  },

  update: function(req, res) {
    User.findOne({id: req.params.id}).then(function(user){
      console.log('user retrieve function', user)
      Passport.find({user: user.id}).then(function(passport){
        // update.getMyUser({}, user.username, req, res)
        console.log("Passport found")
      })
    })

  }
};
