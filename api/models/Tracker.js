/**
* Tracker.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
    type: {
      type: 'string'
    },
    name: {
      type: 'string'
    },
    data: {
      type: 'json'
    },

    //////////////////
    // Associations //
    //////////////////
    twitter_accounts: {
      collection: 'Twitter_Account',
      via: 'trackers'
    }
  },
  beforeCreate: function(values, callback) {
    values.name = values.name.toLowerCase();
    callback();
  }
};

