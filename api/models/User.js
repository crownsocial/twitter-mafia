var bcrypt = require('bcryptjs');

module.exports = {

  attributes: {
    email: {
      type: 'email',
      required: true,
      unique: true
    },
    password: {
      type: 'string',
      minLength: 8,
      required: true
    },
    socketId: {
      type: 'string'
    }
  },
  beforeCreate: function(values, callback) {

    // salt is 10 digits
    bcrypt.hash(values.password, 10, function(err, hash) {

      // callback with error
      if (err) return callback(err);

      values.password = hash;

      // callback without arguments is success;
      callback();
    });
  }
};

