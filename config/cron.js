// var sendEmail = require('../api/')

var twitter = require('twitter');
var client = new twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});


var fs = require('fs')
var utility = require('../api/helpers/utilities.js')

// var file = new File('/Users/nguyenalexander/Crown_Social/projects/twitter-analytics/test/cron.json');

module.exports.cron = {
  '*/15 * * * * *': function() {
    Twitter_Account.find().populateAll().exec(function(err, data){
      data.forEach(function(account){
        var influencerNames = account.influencers.map(function(influencer){
          return 'from:'+influencer.name;
        }).join(' OR ');
        console.log(influencerNames)
        client.get('search/tweets', {q: influencerNames+' since:2015-07-21', result_type: 'recent', count: 100}, function(err, data, response){
          if (!err){
            var obj = {};
            for (var i = 0; i < data.statuses.length; i++){
              if (!obj[data.statuses[i].user.screen_name.toLowerCase()]){
                obj[data.statuses[i].user.screen_name.toLowerCase()] = data.statuses[i];
              }
              if (Object.keys(obj).length == account.influencers.length){
                break;
              }
            }
            console.log('object:', obj)
            utility.sendEmail("alex@crownsocial.com", "Item has been updated", JSON.stringify(obj));
            async.each(Object.keys(obj), function(key, callback){
              Tracker.update({name: key, type: 'influencer'}, {data: obj[key]}).exec(function(err, updated){
                console.log(updated)
                callback();
              }, function(err){

              })
            })
          }
        })
      })
    })
  },
  // '*/5 * * * * *': function() {
  //   client.get('users/show', {screen_name: 'microsoftdesign'}, function(err, data, response){
  //     if(!err) {

  //     }
  //   })
  // }
}

    // new CronJob('* */15 * * * *', function() {
    //     client.get("users/show", {screen_name: "alexthephallus"}, function(error, data, response) {
    //     if (!error) {

    //       formatDates(data);
    //       sendEmail("alex@crownsocial.com", "Cron job message", "You should get this every ten seconds: " + JSON.stringify(data));
    //     } else {
    //       console.log("Error:", error);
    //     }
    //   });
    // }, null, true, 'America/Los_Angeles');