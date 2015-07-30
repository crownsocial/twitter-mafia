var twitter = require('twitter');
var client = new twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var fs = require('fs')
var utility = require('../api/helpers/utilities.js')

// checkDataType parses the tweet object to find any matching influencers, hashtags, or mentions and then returns an array of each found in the tweet
var checkDataType = function(tweet, trackers) {
  var mentions = tweet.entities.user_mentions;
  var hashtags = tweet.entities.hashtags;

  for(var i = 0; i < trackers.length; i++) {
    if(trackers[i].type === "influencer" && tweet.user.screen_name.toLowerCase() === trackers[i].name) {
        return {tweet: tweet, tracker: trackers[i]}
    } else if(trackers[i].type === "mention" && tweet.entities.user_mentions.length > 0 && !tweet.retweet_status) {
        for(var j = 0; j < mentions.length; j++) {
            if(trackers[i].name === mentions[j].screen_name.toLowerCase()) {
                return {tweet: tweet, tracker: trackers[i]}
            }
        }
    } else if(trackers[i].type === "hashtag" && hashtags.length > 0 && !tweet.retweet_status) {
        for(var j = 0; j < hashtags.length; j++) {
            if(trackers[i].name === hashtags[j].text.toLowerCase()) {
                return {tweet: tweet, tracker: trackers[i]}
            }
        }
    }

  }
  return false;
}

module.exports.twitterstream = function() {
    Tracker.find().populateAll().exec(function(err, trackers) {
        if(!err) {
            var track = trackers.map(function(t) {
                if(t.type == "influencer") {
                    return t.twitter_id;
                } else {
                    return t.name;
                }
            }).join(',');

            client.stream('statuses/filter', {track: track}, function(stream) {
              stream.on('data', function(tweet) {
                console.log(tweet.text);
                var trackerData = checkDataType(tweet, trackers);
                console.log("Tracker Data:",trackerData !== null)
                if(trackerData) {
                    async.each(trackerData.tracker.twitter_accounts ,function(account, callback) {
                        Twitter_Account.findOne({id: account.id}).populate('user').exec(function(err, account) {
                            if(!err) {
                                console.log("sending email...",account)
                                callback(utility.sendEmail(account.user.email, "[TwitterMafiaApp] You have new updates!", trackerData, false));
                            } else {
                                callback(err)
                            }
                        });
                    });
                }
                console.log("*************************************\n\n");
              });

              stream.on('error', function(error) {
                console.log("ERROR!!",error)
                throw error;
              });
            });
        }
    });
}