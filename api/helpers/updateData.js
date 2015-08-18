var twitter = require('twitter');
var utility = require('./utilities');

var client = new twitter({
  consumer_key: process.env.TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

module.exports = function() {
  Twitter_Account.find().populateAll().exec(function(err, accounts){
    async.eachSeries(accounts, function(account, callback) {
      client.get("statuses/user_timeline", {user_id: account.twitter_id, include_rts: false}, function(err, data, response) {
        if(err) {
          callback(err);
        } else {
          data.forEach(function(tweet) {
            Tweet.findOne({tweet_id: tweet.id}).exec(function(err, foundTweet) {
              if(foundTweet) {
                console.log(foundTweet)
                foundTweet.retweet_count = tweet.retweet_count;
                foundTweet.favorite_count = tweet.favorite_count;
                foundTweet.save();
              } else {
                Tweet.create({tweet_id: tweet.id, date: tweet.date, text: tweet.text, retweet_count: tweet.retweet_count, favorite_count: tweet.favorite_count, entities: tweet.entities, twitter_account: account.id}).exec(function(err, addedTweet) {
                  account.tweets.add(addedTweet);
                });
              }
            })
          });
          client.get("users/show", {user_id: account.twitter_id}, function(err, data, response) {
            account.followers_count = data.followers_count;
            account.friends_count = data.friends_count;
            account.verified = data.verified;
            // account.favorites_count = data.favorite_count;
            account.save();
            console.log("\nvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv");
            console.log("Updating:",account.username);
            console.log(account);
            console.log("***************************************************\n");
            callback();
          });
        }
      });
    }, function(err) {
      console.log("Twitter statuses/user_timeline error:",err);
    });
  });
}


    // Link in the update functions here

    /*******************************************************************************
    * FIXME: This "callback hell" should be made completely asynchronous at some point.
    * For now, we're just trying to get it to work.
    *
    * This gets, in sequence: myUser, myFollowers, myTweets, influencers, hashtagPosts.
    * For now, we're just passing these objects to the HTML directly.
    *
    * The desired data will eventually be stored in the database,
    * and then only the desired data from the database will be passed to the HTML.
    *******************************************************************************/

//     var getHashtagPosts = function(object, hashtags, res) {
//       var hashtagPosts = [];
//       async.each(hashtags, function(hashtag, callback) {
//         client.get("search/tweets", {q: "#" + hashtag}, function(error, data, response) {
//           if (!error) {
//             utility.formatDates(data.statuses);
//             var topTweet = utility.markTopTweets(data.statuses);
//             hashtagPosts.push({hashtag: hashtag, tweets: data.statuses, topTweet: topTweet});
//             callback();
//           } else {
//             callback(error);
//           }
//         })
//       }, function(error) {
//         if (!error) {
//           console.log("get hashtag posts successful.");

//           object.hashtagPosts = hashtagPosts;

//           /*******************************************************************************
//           * Hard-coded call to send email for testing purposes
//           * Delete at any time
//           *******************************************************************************/

//           // utility.sendEmail("alex@crownsocial.com", "Passing the object", JSON.stringify(object));

//           console.log("my user top tweet", object.myTopTweet.id_str, object.myTopTweet.text);
//           console.log("influencer 1 top tweet", object.influencers[0].topTweet.user.screen_name, object.influencers[0].topTweet.text);
//           console.log("influencer 2 top tweet", object.influencers[1].topTweet.user.screen_name, object.influencers[1].topTweet.text);
//           console.log("influencer 3 top tweet", object.influencers[2].topTweet.user.screen_name, object.influencers[2].topTweet.text);
//           console.log(object.hashtagPosts[0].hashtag, "top tweet", object.hashtagPosts[0].topTweet.user.screen_name, object.hashtagPosts[0].topTweet.text);
//           console.log(object.hashtagPosts[1].hashtag, "top tweet", object.hashtagPosts[1].topTweet.user.screen_name, object.hashtagPosts[1].topTweet.text);
//           console.log(object.hashtagPosts[2].hashtag, "top tweet", object.hashtagPosts[2].topTweet.user.screen_name, object.hashtagPosts[2].topTweet.text);

//           res.send(object);
//         } else {
//           res.send("Error:", error);
//         }
//       })
//     }

//     var getInfluencers = function(object, influencers, res) {
//       var params = {screen_name: influencers.join(",")};
//       client.get("users/lookup", params, function(error, data, response) {
//         if (!error) {
//           utility.formatDates(data);
//           var hashtags = ["socialmedia", 'microsoft', 'inclusivedesign']
//           object.influencers = data;
//           async.each(data, function(influencer, callback) {
//             var params = {user_id: influencer.id_str, count: 10, include_rts: 1};
//             client.get("statuses/user_timeline", params, function(error, data, response) {
//               if (!error) {
//                 utility.formatDates(data);
//                 influencer.tweets = data;
//                 influencer.topTweet = utility.markTopTweets(data);
//                 callback();
//               } else {
//                 callback(error);
//               }
//             })
//           }, function(error) {
//             if (!error) {
//               console.log("get influencers successful.");
//               getHashtagPosts(object, hashtags, res);
//             } else {
//               res.send("Error:", error);
//             }
//           });

//         } else {
//           res.send("Error:", error);
//         }
//       })
//     }

//     var getMyTweets = function(object, user_id, res) {
//       object.myTweets = [];
//       console.log('************************************');
//       console.log(object);
//       console.log('************************************');
//       var influencers = ['emccorp','microsoftdesign','zapan'];
//       var params = {user_id: user_id, count: 10, include_rts: 0};
//       client.get("statuses/user_timeline", params, function(error, data, response) {
//         if (!error) {
//           // var influencers = ['MicrosoftDesign', 'EMC', 'Zapan']
//           console.log("get tweets successful.");
//           utility.formatDates(data);
//           async.eachSeries(data, function(tweet, callback){
//             console.log(tweet.date)
//             var timestamp = tweet.date.replace(' ', '').split(',');
//             TweetCollection.findOrCreate(
//               {month: timestamp[1], year: timestamp[2], twitter_account: object.myTwitterAccount.id},
//               {day: timestamp[0], month: timestamp[1], year: timestamp[2], twitter_account: object.myTwitterAccount, tweets: []})
//             .populate('tweets')
//             .exec(function(err, tweetCol){
//               console.log('after find or create:', tweetCol)
//               if (tweetCol){
//                 object.myTweets.unshift(tweetCol);
//                 // object.myTwitterAccount.tweetCollections.unshift(tweetCol)
//                 Tweet.findOrCreate({tweet_id: tweet.id}, {tweet_id: tweet.id, date: tweet.date, text: tweet.text, retweet_count: tweet.retweet_count, favorite_count: tweet.favorite_count, entities: tweet.entities, tweetCollection: tweetCol.id}).exec(function(err, addedTweet){
//                   tweetCol.tweets.unshift(addedTweet)
//                   console.log('tweet added:', addedTweet)
//                   callback()
//                 })
//               }
//             })
//           }, function(err){
//             if (err) {console.log(err)}
//             console.log('end of async db call reached')
//           })
//           object.myTopTweet = utility.markTopTweets(data);
//           getInfluencers(object, influencers, res);
//         } else {
//           res.send("Error:", error);
//         }
//       });
//     }

//     var getMyFollowers = function(object, user_id, res) {
//       var params = {user_id: user_id};
//       client.get("followers/ids", params, function (error, data, response) {
//         if (!error) {

//           var ids = data.ids; // array of user ids

//           // separate lists of a hundred, at most 10 for now
//           // each list is a single string of user ids separated by comma
//           var listsOf100 = [];
//           while (listsOf100.length < 10 && ids.length > 0) {
//             var listString = ids.splice(0, 100).join(",");
//             listsOf100.push(listString);
//           }

//           // call Twitter API, 100 followers at a time
//           var followers = [];
//           async.each(listsOf100, function(listString, callback) {

//             var params = {user_id: listString};
//             client.get("users/lookup", params, function(error, data, response) {
//               if (!error) {

//                 // success
//                 utility.formatDates(data);
//                 followers = followers.concat(data);
//                 callback();

//               } else {
//                 callback(error);
//               }
//             })

//           }, function(error) {

//             if (!error) {
//               console.log("get followers successful.");

//               // add remaining ids
//               var remainingIds = ids.map(function(id) {
//                 return { id_str: id, status: { id_str: "" } };
//               })
//               followers = followers.concat(remainingIds);
//               object.myFollowers = followers;

//               // get follower descriptions
//               var descriptions = [];
//               followers.forEach(function(follower) {
//                 if (follower.description) {
//                   descriptions.push(follower.description);
//                 }
//               });

//               // sort descriptions, and add to object
//               object.wordCountArray = utility.sortedArrayOfWordCounts(descriptions);

//               getMyTweets(object, user_id, res);

//             } else {
//               res.send("Error:", error);
//             }

//           })
//         } else {
//           res.send("Error:", error);
//         }
//       });
//     }

//  module.exports = {
//     getMyUser: function(object, username, req, res) {
//       var params;
//       if (isNaN(parseInt(username))) {
//         params = {screen_name: username};
//       } else {
//         params = {user_id: username};
//       }
//       client.get("users/show", params, function(error, data, response) {
//       console.log('************************************');
//         console.log(data);
//       console.log('************************************');
//         if (!error) {
//           console.log("get user successful.");
//           object.myUser = data;
//           User.findOne({id: req.session.user.id}).exec(function(err, user){
//               Twitter_Account.findOrCreate(
//                 {twitter_id: data.id_str}, {
//                   twitter_id: data.id_str,
//                   name: data.name,
//                   screen_name: data.screen_name,
//                   description: data.description,
//                   followers_count: data.followers_count,
//                   friends_count: data.friends_count,
//                   verified: data.verified,
//                   profile_image: data.profile_image_url,
//                   latest_status: data.status,
//                   url: data.url,
//                   user: req.session.user.id
//                 })
//               .populate('tweetCollections').exec(function(err, twitterAcc){
//                 if (!user.twitter_accounts) {
//                   user.twitter_accounts = [];
//                 }
//                 user.twitter_accounts.push(twitterAcc);
//                 user.save();
//                 object.myTwitterAccount = twitterAcc;
//                 console.log('twitter account stored into database', twitterAcc)
//                 console.log('user associated twitter acc: ', user.twitter_accounts)
//               })
//               getMyFollowers(object, data.id_str, res);
//           })
//         } else {
//           res.send("Error:", error);
//         }
//       });
//     }

// }