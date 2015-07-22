// api/controllers/UserController.js

var twitter = require('twitter');
var moment = require("moment");
var nodemailer = require("nodemailer");
var CronJob = require('cron').CronJob;
// var async = require('async')
var _ = require('lodash')

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
    * FIXME: This "callback hell" should be made completely asynchronous at some point.
    * For now, we're just trying to get it to work.
    *
    * This gets, in sequence: myUser, myFollowers, myTweets, influencers, hashtagPosts.
    * For now, we're just passing these objects to the HTML directly.
    *
    * The desired data will eventually be stored in the database,
    * and then only the desired data from the database will be passed to the HTML.
    *******************************************************************************/

    var getHashtagPosts = function(object, hashtags, res) {
      var hashtagPosts = [];
      async.each(hashtags, function(hashtag, callback) {
        client.get("search/tweets", {q: "#" + hashtag}, function(error, data, response) {
          if (!error) {
            formatDates(data.statuses);
            var topTweet = markTopTweets(data.statuses);
            hashtagPosts.push({hashtag: hashtag, tweets: data.statuses, topTweet: topTweet});
            callback();
          } else {
            callback(error);
          }
        })
      }, function(error) {
        if (!error) {
          console.log("get hashtag posts successful.");

          object.hashtagPosts = hashtagPosts;

          /*******************************************************************************
          * Hard-coded call to send email for testing purposes
          * Delete at any time
          *******************************************************************************/

          sendEmail("alex@crownsocial.com", "Passing the object", JSON.stringify(object));

          console.log("my user top tweet", object.myTopTweet.id_str, object.myTopTweet.text);
          console.log("influencer 1 top tweet", object.influencers[0].topTweet.user.screen_name, object.influencers[0].topTweet.text);
          console.log("influencer 2 top tweet", object.influencers[1].topTweet.user.screen_name, object.influencers[1].topTweet.text);
          console.log("influencer 3 top tweet", object.influencers[2].topTweet.user.screen_name, object.influencers[2].topTweet.text);
          console.log(object.hashtagPosts[0].hashtag, "top tweet", object.hashtagPosts[0].topTweet.user.screen_name, object.hashtagPosts[0].topTweet.text);
          console.log(object.hashtagPosts[1].hashtag, "top tweet", object.hashtagPosts[1].topTweet.user.screen_name, object.hashtagPosts[1].topTweet.text);
          console.log(object.hashtagPosts[2].hashtag, "top tweet", object.hashtagPosts[2].topTweet.user.screen_name, object.hashtagPosts[2].topTweet.text);

          res.send(object);
        } else {
          res.send("Error:", error);
        }
      })
    }

    var getInfluencers = function(object, influencers, res) {
      var params = {screen_name: influencers.join(",")};
      client.get("users/lookup", params, function(error, data, response) {
        if (!error) {
          formatDates(data);
          var hashtags = ["socialmedia", 'microsoft', 'inclusivedesign']
          object.influencers = data;
          async.each(data, function(influencer, callback) {
            var params = {user_id: influencer.id_str, count: 10, include_rts: 1};
            client.get("statuses/user_timeline", params, function(error, data, response) {
              if (!error) {
                formatDates(data);
                influencer.tweets = data;
                influencer.topTweet = markTopTweets(data);
                callback();
              } else {
                callback(error);
              }
            })
          }, function(error) {
            if (!error) {
              console.log("get influencers successful.");
              getHashtagPosts(object, hashtags, res);
            } else {
              res.send("Error:", error);
            }
          });

        } else {
          res.send("Error:", error);
        }
      })
    }

    var getMyTweets = function(object, user_id, res) {
      object.myTweets = [];
      var params = {user_id: user_id, count: 10, include_rts: 0};
      client.get("statuses/user_timeline", params, function(error, data, response) {
        if (!error) {
          // var influencers = ['MicrosoftDesign', 'EMC', 'Zapan']
          console.log("get tweets successful.");
          formatDates(data);
          async.eachSeries(data, function(tweet, callback){
            console.log(tweet.date)
            var timestamp = tweet.date.replace(' ', '').split(',');
            TweetCollection.findOrCreate(
              {month: timestamp[1], year: timestamp[2], twitter_account: object.myTwitterAccount.id},
              {day: timestamp[0], month: timestamp[1], year: timestamp[2], twitter_account: object.myTwitterAccount, tweets: []})
            .populate('tweets')
            .exec(function(err, tweetCol){
              console.log('after find or create:', tweetCol)
              if (tweetCol){
                object.myTweets.unshift(tweetCol);
                // object.myTwitterAccount.tweetCollections.unshift(tweetCol)
                Tweet.findOrCreate({tweet_id: tweet.id}, {tweet_id: tweet.id, date: tweet.date, text: tweet.text, retweet_count: tweet.retweet_count, favorite_count: tweet.favorite_count, entities: tweet.entities, tweetCollection: tweetCol.id}).exec(function(err, addedTweet){
                  tweetCol.tweets.unshift(addedTweet)
                  console.log('tweet added:', addedTweet)
                  callback()
                })
              }
            })
          }, function(err){
            if (err) {console.log(err)}
            console.log('end of async db call reached')
          })
          object.myTopTweet = markTopTweets(data);
          getInfluencers(object, influencers, res);
        } else {
          res.send("Error:", error);
        }
      });
    }

    var getMyFollowers = function(object, user_id, res) {
      var params = {user_id: user_id};
      client.get("followers/ids", params, function (error, data, response) {
        if (!error) {

          var ids = data.ids; // array of user ids

          // separate lists of a hundred, at most 10 for now
          // each list is a single string of user ids separated by comma
          var listsOf100 = [];
          while (listsOf100.length < 10 && ids.length > 0) {
            var listString = ids.splice(0, 100).join(",");
            listsOf100.push(listString);
          }

          // call Twitter API, 100 followers at a time
          var followers = [];
          async.each(listsOf100, function(listString, callback) {

            var params = {user_id: listString};
            client.get("users/lookup", params, function(error, data, response) {
              if (!error) {

                // success
                formatDates(data);
                followers = followers.concat(data);
                callback();

              } else {
                callback(error);
              }
            })

          }, function(error) {

            if (!error) {
              console.log("get followers successful.");

              // add remaining ids
              var remainingIds = ids.map(function(id) {
                return { id_str: id, status: { id_str: "" } };
              })
              followers = followers.concat(remainingIds);
              object.myFollowers = followers;

              // get follower descriptions
              var descriptions = [];
              followers.forEach(function(follower) {
                if (follower.description) {
                  descriptions.push(follower.description);
                }
              });

              // sort descriptions, and add to object
              object.wordCountArray = sortedArrayOfWordCounts(descriptions);

              getMyTweets(object, user_id, res);

            } else {
              res.send("Error:", error);
            }

          })
        } else {
          res.send("Error:", error);
        }
      });
    }

    var getMyUser = function(object, username, req, res) {
      var params;
      if (isNaN(parseInt(username))) {
        params = {screen_name: username};
      } else {
        params = {user_id: username};
      }
      client.get("users/show", params, function(error, data, response) {

        if (!error) {
          console.log("get user successful.");
          object.myUser = data;
          Twitter_Account.findOrCreate(
            {twitter_id: data.id}, {
              twitter_id: data.id,
              name: data.name,
              screen_name: data.screen_name,
              description: data.description,
              followers_count: data.followers_count,
              friends_count: data.friends_count,
              verified: data.verified,
              profile_image: data.profile_image_url,
              latest_status: data.status,
              url: data.url,
              user: req.session.user.id
            })
          .populate('tweetCollections').exec(function(err, twitterAcc){
            console.log('twitter account stored into database', twitterAcc)
            object.myTwitterAccount = twitterAcc;
          })
          getMyFollowers(object, data.id_str, res);
        } else {
          res.send("Error:", error);
        }
      });
    }

    /*******************************************************************************
    * helper method for formatting dates
    *******************************************************************************/

    var formatDates = function(entities) {
      if (!Array.isArray(entities)) {
        entities = [entities];
      }

      entities.forEach(function(entity) {

        // check http://momentjs.com/docs/#/displaying/
        entity.date = moment(Date.parse(entity.created_at)).format("D, M, YY, HHH, ddd");
      });
    }

    /*******************************************************************************
    * helper method for marking top tweet(s) with highest retweet + favourite count
    * with a top_tweet: true property
    *
    * return first top tweet

          // $scope.overlayData = {
      //     $scope.lineLabels: ["July"],
      //     $scope.lineDatasets: [
      //       {
      //         label: "total followers",
      //         type: "bar",
      //         fillColor: "rgba(128, 128, 128, 0.4)",
      //         strokeColor: "rgba(128, 128, 128, 0.8)",
      //         highlightFill: "rgba(228, 135, 27, 0.75)",
      //         highlightStroke: "rgba(228, 135, 27, 1)",
      //         data: [$scope.user.myUser.followers_count]
      //       },
      //       {
      //         label: "engagements per post",
      //         type: "line",
      //         fillColor: "rgba(192, 192, 192,0.4)",
      //         strokeColor: "rgba(192, 192, 192,0.8)",
      //         pointColor: "rgba(192, 192, 192,1)",
      //         pointStrokeColor: "#fff",
      //         pointHighlightFill: "#fff",
      //         pointHighlightStroke: "rgba(110,110,110,1)",
      //         data: [65]
      //       }
      //     ]
      //   };

      //   $scope.barData = {
      //     labels: ["July"],
      //     datasets: [
      //       {
      //         label: "total tweets",
      //         fillColor: "rgba(160, 160, 160, 0.4)",
      //         strokeColor: "rgba(160, 160, 160, 0.8)",
      //         highlightFill: "rgba(228, 135, 27, 0.75)",
      //         highlightStroke: "rgba(228, 135, 27, 1)",
      //         data: [$scope.user.myUser.statuses_count]
      //       }
      //     ]
      //   };

      //   $scope.doughnutData = [
      //     {
      //       value: 125,
      //       color:"rgb(96, 96, 96)",
      //       highlight: "rgb(228, 135, 27)",
      //       label: "replies"
      //     },
      //     {
      //       value: 100,
      //       color: "rgb(160, 160, 160)",
      //       highlight: "rgb(228, 135, 27)",
      //       label: "retweets"
      //     },
      //     {
      //       value: 50,
      //       color: "rgb(128, 128, 128)",
      //       highlight: "rgb(228, 135, 27)",
      //       label: "links"
      //     },
      //     {
      //       value: 75,
      //       color: "rgb(192, 192, 192)",
      //       highlight: "rgb(228, 135, 27)",
      //       label: "hashtags"
      //     }
      //   ]
    *******************************************************************************/

    var markTopTweets = function(tweets) {
      var topCount = 0;
      var topIndices = [];
      tweets.forEach(function(tweet, index) {
        var thisCount = tweet.retweet_count + tweet.favorite_count;
        tweet.engagements = thisCount;
        if (thisCount > topCount) {
          topCount = thisCount;
          topIndices = [index];
        } else if (thisCount == topCount) {
          topIndices.push(index);
        }
      });
      topIndices.forEach(function(topIndex) {
        tweets[topIndex].top_tweet = true;
      })
      return tweets[topIndices[0]];
    }


    /*******************************************************************************
    * helper method to convert an array of text descriptions
    * into an array of objects, sorted from highest to lowest count.
    * The object format is [ {word: "string1", count: n}, ... ].
    *******************************************************************************/

    var sortedArrayOfWordCounts = function(strings) {
      if(!strings) return;

      // Convert array to a long string
      strings = strings.join(' ');

      // Strip stringified objects and punctuations from the string
      strings = strings.toLowerCase().replace(/object Object/g, '').replace(/[\+\.,\/#!$%\^&\*{}=_`~]/g,'');

      // Convert the str back into an array
      strings = strings.split(' ');

      // Count frequency of word occurrence
      var wordCount = {};

      for(var i = 0; i < strings.length; i++) {
        if (!wordCount[strings[i]])
            wordCount[strings[i]] = 0;

        wordCount[strings[i]]++; // {'hi': 12, 'foo': 2 ...}
      }

      var wordCountArr = [];

      for(var prop in wordCount) {
        wordCountArr.push({word: prop, count: wordCount[prop]});
      }

      // sort based on count, largest first
      wordCountArr.sort(function(objectA, objectB) {
        return objectB.count - objectA.count;
      });

      return wordCountArr;
    }

    /*******************************************************************************
    * helper method for sending email through Gmail
    *******************************************************************************/

    var sendEmail = function(email_to, subject, content, callback) {
      var smtpTransport = nodemailer.createTransport("SMTP", {
        service: "Gmail",
        auth: {
          user: process.env.GMAIL_ADDRESS,
          pass: process.env.GMAIL_PASSWORD
        }
      });

      var mailOptions = {
        to: email_to,
        subject: subject,
        text: content
      }

      smtpTransport.sendMail(mailOptions, function(error, response) {
        if (callback) {
          callback(error, response);
        }
      });
    }

    /*******************************************************************************
    * Testing methods for cron jobs
    * Delete at any time
    *******************************************************************************/

    // logs a message every five seconds
    new CronJob('*/5 * * * * *', function() {
      // console.log(new Date(), 'You will see this message every 5 seconds.');
    }, null, true, 'America/Los_Angeles');

    // logs a message every minute
    new CronJob('00 * * * * *', function() {
      // console.log(new Date(), 'You will see this message every minute.');
    }, null, true, 'America/Los_Angeles');

    // every ten seconds, this will make an API call and then email the result

    /*******************************************************************************
    * Alex comment
    *******************************************************************************/

    User.findOne({id: req.params.id}).then(function(user){
      console.log('user retrieve function', user)
      Passport.find({user: user.id}).then(function(passport){
        getMyUser({}, user.username, req, res)
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
