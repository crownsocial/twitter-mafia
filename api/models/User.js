var User = {

  attributes: {
    email: {
      type: 'email',
      unique: true
    },
    username: {
      type: 'string',
      unique: true
    },
    passports : {
      collection: 'Passport',
      via: 'user'
    },
    twitter_accounts: {
      collection: 'Twitter_Account',
      via: 'user'
    }
  }
};

module.exports = User;
