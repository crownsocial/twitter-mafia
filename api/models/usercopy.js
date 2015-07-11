// var User = {
//   // Enforce model schema in the case of schemaless databases

// /**
// * User.js
// *
// * @description :: TODO: You might write a short summary of how this model works and what it represents here.
// * @docs        :: http://sailsjs.org/#!documentation/models
// */
//   schema: true,

//   attributes: {
//     email: {
//       type: 'email',
//       required: true,
//       unique: true
//     },
//     password: {
//       type: 'string',
//       minLength: 8,
//       required: true
//     },
//     socketId: {
//       type: 'string'
//     },
//     telephone: {
//       type: 'string',
//     },
//     twitter_accounts: {
//       collection: 'Twitter_Account',
//       via: 'user'
//     },
//     passports: {
//       collection: 'Passport',
//       via: 'user'
//     }
//   },
//   beforeCreate: function(values, callback) {

//     // salt is 10 digits
//     bcrypt.hash(values.password, 10, function(err, hash) {

//       // callback with error
//       if (err) return callback(err);

//       values.password = hash;

//       // callback without arguments is success;
//       callback();
//     });
//   }
// };

// module.exports = User;
