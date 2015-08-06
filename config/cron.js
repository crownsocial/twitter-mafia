var twitter = require('twitter');
var client = new twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});


var fs = require('fs')
var utility = require('../api/helpers/utilities.js')

var checkLatestId = function(current, tweet) {
  if(current.latest_id < tweet.id_str) {
    return tweet.id_str;
  } else {
    return current.latest_id;
  }
}
module.exports.cron = {
  '* * 0,12 * * *': function() {
    require('../api/helpers/updateData.js')();
  }
}
