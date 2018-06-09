const User = require('../model/user');
const path = require('path');
const jwt = require('jsonwebtoken');
const config = require('../dbconfig');
const Sql = require('../DATSQL/DATSql');

var register = (req, res, next) => {
  var user = new User(req.body);
  user.banned = false;

  if (typeof user.password !== 'undefined' && typeof user.name != 'undefined') {
    user.save(function(error, user_id) {
      if (error) {
        res.status(400).send({'error':'Could not create user.'});
      } else {
        next();
      }
    });
  } else {
    res.status(400).send({'error':'Must have password.'});
  }
};

var createAdmin = (req, res, next) => {
  var user = new User();
  user.name = 'Admin';
  user.banned = false;
  user.admin = true;
  user.password = '123';
  user.create(function(error, u) {
    if (error) {
      res.status(400).send({'error':'Could not get user.'});
    } else {
      next();
    }
  });
};

var loadPic = (req, res, next) => {
  var user = new User(req.body);
  user.id = req.user.id;
  user.image = req.body.image;

  if (typeof user.image !== 'undefined') {
    user.savePic(function(error, user_id) {
      if (error) {
        res.status(400).send({'error':'Could not upload picture.'});
      } else {
        //req.token = jwt.sign(user, config.app.accessKey);
        next();
      }
    });
  } else {
    res.status(400).send({'error':'Could not upload picture.'});
  }
};

var ban = (req, res, next) => {
  var user = new User(req.body);
  user.id = req.body.found_user_id;
  user.banned = true;

  if (typeof user.id !== 'undefined') {
    user.banUser(function(error, user_id) {
      if (error) {
        res.status(400).send({'error':'Could not ban user.'});
      } else {
        next();
      }
    });
  } else {
    res.status(400).send({'error':'Could not ban user.'});
  }
};

var login = (req, res, next) => {
  if (typeof req.body.name !== 'undefined' && typeof req.body.password !== 'undefined') {
    const user = new User(req);
    user.authenticate(function(error, userinfo) {
      if (error) {
        res.status(401).send(error);
      } else {
        req.user = userinfo;
        req.token = jwt.sign(userinfo, config.app.accessKey);
        next();
      }
    });
  } else {
    res.status(401).send('Missing name and/or password in request.');
  }
};

var logout = (req, res, next) => {
  if (clearTokenCookie(req, res)) {
    next();
  } else {
    res.status(400).send({'error':'Cookie not found.'});
  }
};

var clearTokenCookie = (req, res, next) => {
  if (req.cookies['x_access_token']) {
    res.clearCookie('x_access_token');
    return true;
  }
  return false;
}


var getUser = (req, res, next) => {
  var user_id = req.user_id || req.body.user_id || req.params.user_id;
  var user = new User();
  user.id = user_id;
  user.get(function(error, u) {
    if (error) {
      res.status(400).send({'error':'Could not get user.'});
    } else {
      req.found_user = new User(u);
      req.found_user.id = user_id;
      next();
    }
  });
};

var updateUser = (req, res, next) => {
  var user = new User(req);
  user.update(function(error, result) {
    if (error) {
      res.status(400).send({'error':'Could not update user.'});
    } else {
      next();
    }
  });
};

module.exports = {
  login,
  register,
  logout,
  clearTokenCookie,
  getUser,
  loadPic,
  ban,
  updateUser,
  createAdmin
}
