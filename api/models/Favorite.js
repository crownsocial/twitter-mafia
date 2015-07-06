module.exports = {

  attributes: {
    date: {
      type: 'string'
    },
    id: {
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
    entities: {
      type: 'string'
    },
    twitter_account: {
      model: 'Twitter_Account'
    }
  }
};

