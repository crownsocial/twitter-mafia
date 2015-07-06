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
    // assocations below -- nested one level deep; not sure how to continue.
    // tweets: {
    //   collection: 'Tweet',
    //   via: 'follower'
    // },
    // favorites: {
    //   collection: 'Favorite',
    //   via: 'follower'
    // },
    // followers: {
    //   collection: 'Follower',
    //   via: 'follower'
    // },
    // friends: {
    //   collection: 'Friend',
    //   via: 'follower'
    // },
    twitter_account: {
      model: 'Twitter_Account'
    }
  }
};

