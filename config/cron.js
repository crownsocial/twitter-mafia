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
  if(current.latest_id < tweet.id_str) {
    return tweet.id_str;
  } else {
    return current.latest_id;
  }
}

// checkDataType parses the tweet object to find any matching influencers, hashtags, or mentions and then returns an array of each found in the tweet
var checkDataType = function(tracker, tweets) {
  // console.log(tweet)
  var obj = { latest_id: "0" };

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

const MAX_CALL_LENGTH = 30;

module.exports.cron = {
  '*/30 * * * * *': function() {
    Twitter_Account.find().populateAll().exec(function(err, data){
      latest_id = 0;
      data.forEach(function(account){
        if(account.user.emailToggle && account.user.email) {
          var qTerms = account.trackers.map(function(tracker){
            console.log("current latest_id = ",latest_id);
            if(tracker.data && tracker.data.latest_id > latest_id) {
              latest_id = tracker.data.latest_id;
            console.log("set latest_id = ",latest_id);
            }

            switch(tracker.type) {
              case 'influencer':
                return 'from:' + tracker.name;
              case 'hashtag':
                return '#' + tracker.name + ' -RT';
              case 'mention':
                return '@' + tracker.name + ' -RT';
            }
          })
          var callTimes = Math.ceil(qTerms.length / MAX_CALL_LENGTH)
          var qSplits = callTimes > 1 ? [] : [{q: qTerms.join(' OR '), latest_id: latest_id}];

          console.log("callTimes:",callTimes,qSplits)
          if(callTimes > 1) {
            for(var i = 0; i < callTimes; i++) {
              var start = (i)*MAX_CALL_LENGTH
              var end = (i+1)*MAX_CALL_LENGTH
              if(end > qTerms.length) end = qTerms.length - 1
              qSplits.push({q: qTerms.slice(start, end).join(' OR '), latest_id: latest_id})
            }
          }

          console.log("qSplits",qSplits);
          async.mapSeries(qSplits, function(terms, callback) {
            console.log('Searching twitter for:',terms.q);

            searchParams = {
              q: terms.q,
              result_type: 'recent',
              count: 100
            }

            if(terms.latest_id !== "0") {
              searchParams.since_id = terms.latest_id;
            } else {
              searchParams.q += ' since:' + utility.getPreviousDate();
            }
            // console.log('search params:',searchParams);

            client.get('search/tweets', searchParams, function(err, data, response){
              console.log("error?",err)

              if (!err){
                if(data.statuses.length === 0) {
                  callback(null, {});
                  return;
                }

                var trackerData = {};
                for (var i = 0; i < account.trackers.length; i++){
                  trackerData[account.trackers[i].name+'.'+account.trackers[i].type] = checkDataType(account.trackers[i], data.statuses);
                }
                callback(null, trackerData);
              } else {
                callback(err);
              }
            })
          },
            function(err, results) {
            if(err) console.log("Async Twitter Call ERROR:",err);

            var trackerData = results.reduce(function(obj, curr) {
              for(var key in curr) {
                if(obj[key]) {
                  obj[key].latest_id = curr[key].latest_id > obj[key].latest_id ? curr[key].latest_id : obj[key].latest_d;
                  obj[key].data.concat(curr[key].data);
                } else {
                  obj[key] = curr[key];
                }
              }
              return obj;
            }, {});

            var numOfTweets = Object.keys(trackerData).length;

            if(false) {
              fs.writeFile("../tweetData.json", JSON.stringify(data), function(err) {
                if(err) {
                  return console.log(err);
                }
                console.log("The tweet file was saved!");
              });
              fs.writeFile("../trackerData.json", JSON.stringify(trackerData), function(err) {
                if(err) {
                  return console.log(err);
                }
                console.log("The obj file was saved!");
              });
            }
            console.log('num of tweets:',numOfTweets);
            console.log('\n**************************************************\n');

            if(numOfTweets > 0) {
              utility.sendEmail(account.user.email, "[TwitterMafiaApp] You have new updates!", trackerData, false);
              async.each(Object.keys(trackerData), function(key, callback){
                var keyArr = key.split('.');
                if(trackerData[key].latest_id > 0) {
                  console.log('running async...',key)
                  Tracker.update({name: keyArr[0], type: keyArr[1]}, {data: trackerData[key]}).exec(function(err, updated){
                    console.log(updated)
                    callback();
                  }, function(err){
                  });
                }
              });
            }
          });
        } else {
          console.log(account.user.username, 'update skipped');
        }
      })
    })
  },
}