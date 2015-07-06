/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  index: function(req, res){
    User.find().then(function(users) {
      res.send(users);
    });
  },

  create: function(req, res) {
    console.log(req.body.email, req.body.password);
    User.create({email: req.body.email, password: req.body.password}).then(function(user) {
      res.send(user);
    });
  },

  retrieve: function(req, res) {

  }

  // create: function(req, res){
  //   User.create({email: req.params.email ...})
  // }

};



