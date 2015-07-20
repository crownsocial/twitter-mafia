/**
* TweetCollection.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    tweet_id: {
      type: 'string'
    },
    text: {
      type: 'string'
    },
    source: {
      type: 'string'
    },
    geo: {
      type: 'string'
    },
    coordinates: {
      type: 'string'
    },
    retweet_count: {
      type: 'integer'
    },
    favorite_count: {
      type: 'integer'
    },
    tweetCollection: {
      model: 'TweetCollection'
    }
  }
};
