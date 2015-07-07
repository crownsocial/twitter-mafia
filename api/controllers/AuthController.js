 /**
 * AuthController
 *
 * @description :: Server-side logic for managing auths
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var bcrypt = require('bcrypt')

module.exports = {
  login: function(req, res) {
    User.findOne({email:req.body.email}).then(function(user){
      if(user){
        bcrypt.compare(req.body.password, user.password, function(err, result){
          if (err) return res.send({result:false,error:err});

          if (result) {
            req.session.user = user;
            res.send({
              result: true,
              user: user
            });
          } else {
            res.send({
              result: false,
              error: 'Invalid Password'
            })
          }
        })
      }
    })
  },
  logout: function(req, res){
    delete req.session.user;
    res.send({result:true})
  },
  check: function(req, res){
    var  user = req.session.user || false
    if (user){
      User.update({id: user.id}, {socketId: req.socket.id}).then(function(data){
        res.send({user: user})
      })
    }else{
      res.send({user: false})
    }
  }
}

