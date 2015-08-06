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
    twitterAccounts: {
      model: 'Twitter_Account'
    }
  }
};

module.exports = User;
