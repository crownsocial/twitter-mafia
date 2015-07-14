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
      console.log(req.session.user, req.session.passport)
      res.send({authenticated: true, user: req.session.user, passport: req.session.passport})
    }else{
      res.send(false)
    }
  }

};

