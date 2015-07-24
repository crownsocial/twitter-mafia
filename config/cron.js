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

var checkLatestId = function(current, tweet) {
  if(current.latest_id < tweet.id) {
    return tweet.id;
  } else {
    return current.latest_id;
  }
}

// checkDataType parses the tweet object to find any matching influencers, hashtags, or mentions and then returns an array of each found in the tweet
var checkDataType = function(tracker, tweets) {
  // console.log(tweet)
  var obj = { latest_id: 0 };

  obj.data = tweets.reduce(function(collection, tweet) {
    var hashtags = tweet.entities.hashtags;
    var mentions = tweet.entities.user_mentions;
    // console.log(tracker.name, tweet.user.screen_name.toLowerCase());
    if(tracker.type === 'influencer' && tweet.user.screen_name.toLowerCase() === tracker.name) { // check tweet.user.screen_name
      collection.push(tweet);
      obj.latest_id = checkLatestId(obj, tweet);
    } else if (tracker.type === 'hashtag') { // check tweet.entities.hashtags[i].text
      for(var i = 0; i < hashtags.length; i++) {
        if(hashtags[i].text.toLowerCase() === tracker.name) {
          collection.push(tweet);
          obj.latest_id = checkLatestId(obj, tweet);
          break;
        }
      }
    } else if (tracker.type === 'mention') { // check tweet.entities.user_mentions[i].screen_name
      for(var i = 0; i < mentions.length; i++) {
        if(mentions[i].screen_name.toLowerCase() === tracker.name) {
          collection.push(tweet);
          obj.latest_id = checkLatestId(obj, tweet);
          break;
        }
      }
    }
    return collection;
  }, []);
  return obj;
}

module.exports.cron = {
  '*/30 * * * * *': function() {
    Twitter_Account.find().populateAll().exec(function(err, data){
      latest_id = 0;

      data.forEach(function(account){
        var qTerms = account.trackers.map(function(tracker){
          if(tracker.data && tracker.data.latest_id > latest_id) {
            latest_id = tracker.data.latest_id;
          }

          switch(tracker.type) {
            case 'influencer':
              return 'from:' + tracker.name;
            case 'hashtag':
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
            var trackerData = {};
            for (var i = 0; i < account.trackers.length; i++){
              trackerData[account.trackers[i].name+'.'+account.trackers[i].type] = checkDataType(account.trackers[i], data.statuses);
              // if (Object.keys(obj).length == account.trackers.length){
              //   break;
              // }
            }
            // // fs.writeFile("/home/timon/Crown Social/twitter-analytics/tweetdata.json", JSON.stringify(data), function(err) {
            //   if(err) {
            //     return console.log(err);
            //   }
            //   console.log("The tweet file was saved!");
            // });
            // fs.writeFile("/home/timon/Crown Social/twitter-analytics/builtobject.json", JSON.stringify(trackerData), function(err) {
            //   if(err) {
            //     return console.log(err);
            //   }
            //   console.log("The obj file was saved!");
            // });
            console.log('num of tweets:',data.statuses.length);
            console.log('\n**************************************************\n');
            // console.log('trackerData:', trackerData)
            // console.log('\n**************************************************\n');

            if(data.statuses.length !== 0) {
              // utility.sendEmail("msdesign@crownsocial.com", "[TwitterMafiaApp] You have new updates!", trackerData);
              async.each(Object.keys(trackerData), function(key, callback){
                var keyArr = key.split('.');
                if(trackerData[key].latest_id > 0) {
                  console.log('running async...',key)
                  Tracker.update({name: keyArr[0], type: keyArr[1]}, {data: trackerData[key]}).exec(function(err, updated){
                    console.log(updated)
                    callback();
                  }, function(err){
                  })
                }
              })
            }
          }
        })
      })
    })
  },
}