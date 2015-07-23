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

var addToCollection = function(obj, key, add) {
  if(obj[key]) {
    obj[key].push(add);
  } else {
    obj[key] = [add];
  }
  return obj;
}

// checkDataType parses the tweet object to find any matching influencers, hastags, or mentions and then returns an array of each found in the tweet
var checkDataType = function(tweet, trackers) {
  var hashtags = tweet.entities.hashtags;
  var mentions = tweet.entities.user_mentions;

  return trackers.reduce(function(collection, tracker) {
    if(tracker.type === 'influencer' && tweet.screen_name === tracker.name) { // check tweet.user.screen_name

      return addToCollection(collection, tracker.name+'.'+tracker.type, tweet);
    } else if (tracker.type === 'hastag') { // check tweet.entities.hastags[i].text
      for(var i = 0; i < hashtags.length; i++) {
        if(hashtags[i].text.toLowerCase() === tracker.name) {
          return addToCollection(collection, tracker.name+'.'+tracker.type, tweet);
        }
      }
    } else if (tracker.type === 'mention') { // check tweet.entities.user_mentions[i].screen_name
      for(var i = 0; i < mentions.length; i++) {
        if(mentions[i].screen_name.toLowerCase() === tracker.name) {
          return addToCollection(collection, tracker.name+'.'+tracker.type, tweet);
        }
      }
    }
    return collection;
  }, {});
}

module.exports.cron = {
  '*/15 * * * * *': function() {
    Twitter_Account.find().populateAll().exec(function(err, data){
      latest_id = 0;

      data.forEach(function(account){
        var qTerms = account.trackers.map(function(tracker){
          if(tracker.data && tracker.data.id > latest_id) {
            latest_id = tracker.data.id;
          }

          switch(tracker.type) {
            case 'influencer':
              return 'from:' + tracker.name;
            case 'hastag':
              return '#' + tracker.name;
            case 'mention':
              return '@' + tracker.name;
          }
        }).join(' OR ');
        console.log(qTerms);

        searchParams = {
          q: qTerms,
          result_type: 'recent',
          count: 100
        }

        if(latest_id > 0) {
          searchParams.since_id = latest_id;
        } else {
          searchParams.q += ' since:' + utility.getPreviousDate();
        }
        console.log('search params:',searchParams);

        client.get('search/tweets', searchParams, function(err, data, response){
          if (!err){
            var obj = {};
            for (var i = 0; i < data.statuses.length; i++){
              obj = checkDataType(data.statuses[i], account.trackers);
              // if (Object.keys(obj).length == account.trackers.length){
              //   break;
              // }
            }
            console.log('data:',data.statuses.length > 0);
            console.log('\n**************************************************\n');
            console.log('object:', obj)
            console.log('\n**************************************************\n');

            if(Object.keys(obj).length !== 0) {
              // utility.sendEmail("alex@crownsocial.com", "Item has been updated", JSON.stringify(obj));
              async.each(Object.keys(obj), function(key, callback){
                console.log('running async...')
                Tracker.update({name: key, type: 'influencer'}, {data: obj[key]}).exec(function(err, updated){
                  console.log(updated)
                  callback();
                }, function(err){

                })
              })
            }
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