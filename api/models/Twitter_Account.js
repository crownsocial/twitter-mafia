module.exports = {

  attributes: {
    date: {
      type: 'string'
    },
    user_id: {
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
    user_id: {
      type: 'string'
    },
    user_id: {
      type: 'string'
    },
    verified: {
      type: 'boolean'
    },
    // total count of each category. friends = people this account follows, statuses refer to all tweets.
    followers_count: {
      type: 'integer'
    },
    friends_count: {
      type: 'integer'
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
    tweets: {
      collection: 'Tweet',
      via: 'twitter_account'
    },
    favorites: {
      collection: 'Favorite',
      via: 'twitter_account'
    },
    followers: {
      collection: 'Follower',
      via: 'twitter_account'
    },
    friends: {
      collection: 'Friend',
      via: 'twitter_account'
    },
    user: {
      model: 'User'
    }
  }
};

