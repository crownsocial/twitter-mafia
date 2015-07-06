module.exports = {

  attributes: {
    twitter: {
      username: {
        type: 'string'
      },
      id: {
        type: 'string'
      },
      followers: {
        collection: 'followers',
        via: 'followers'
      },
      friends: {
        collection: 'friends',
        via: 'friends'
      }
    }
  }
};

