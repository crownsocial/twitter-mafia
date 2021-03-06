module.exports = {

  attributes: {
    twitter_id: {
      type: 'string',
      unique: true
    },
    date: {
      type: 'string'
    },
    screen_name: {
      type: 'string'
    },
    name: {
      type: 'string'
    },
    description: {
      type: 'string'
    },
    location: {
      type: 'string'
    },
    verified: {
      type: 'boolean'
    },
    // total count of each category. friends = people this account follows, statuses refer to all tweets.
    followers_count: {
      type: 'json'
    },
    friends_count: {
      type: 'json'
    },
    listed_count: {
      type: 'integer'
    },
    favorites_count: {
      type: 'integer'
    },
    statuses_count: {
      type: 'integer'
    },
    // assocations below -- all self explanatory. refer to other models by calling the name (collection) and stating a reference (via).
    tweetCollections: {
      collection: 'TweetCollection',
      via: 'twitter_account'
    },
    tweets: {
      collection: 'Tweet',
      via: 'twitter_account'
    },
    // followers: {
    //   collection: 'Follower',
    //   via: 'twitter_account'
    // },
    // friends: {
    //   collection: 'Friend',
    //   via: 'twitter_account'
    // },
    user: {
      model: 'User'
    },
    trackers: {
      collection: 'Tracker',
      via: 'twitter_accounts'
    }
  }
};

