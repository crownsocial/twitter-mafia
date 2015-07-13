/**
 * ViewController
 *
 * @description :: Server-side logic for managing Views
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  index: function(req,res){
    res.view('index');
  },

  get: function(req,res){
    if(req.session.authenticated === true){
      User.findOne({user: req.user})
      .exec(function(err, data){
        user = data
        res.send({authenticated: true, user: user})
      })
    }else{
      res.send(false)
    }
  }

};

