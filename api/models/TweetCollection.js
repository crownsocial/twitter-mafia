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

