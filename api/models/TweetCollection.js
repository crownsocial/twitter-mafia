/**
* TweetCollection.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    month: {
      type: 'string'
    },
    year: {
      type: 'string'
    },
    day: {
      type: 'string',
    },
    tweets: {
      collection: 'Tweet',
      via: 'tweetCollection'
    },
    twitter_account: {
      model: 'Twitter_Account'
    }
  }
};



