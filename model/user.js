'use strict';

// Import
const Sql = require('../DATSQL/DATSql');
const Pasteurize = require('pasteurize').Pasteurize;

// Definition
class User {
  constructor(blob) {
    var data = blob || {};
    if (typeof blob !== 'undefined') {
      // Default user
      if (typeof blob.user !== 'undefined') {
        if (typeof blob.user.id !== 'undefined') {
          this.id = blob.user.id;
        }
      }
      // Body
      if (typeof blob.body !== 'undefined') {
        if (typeof blob.body.name !== 'undefined') {
          data = blob.body;
        }
      }
    }
    // Properties
    this.name = data.name || null;
    this.banned = data.banned || false;
    this.admin = data.admin || false;
    this.image = data.image || null;
    this.password = data.password || '1234';
  }

  get(callback) {
    if (typeof this.id !== 'undefined') {
      // console.log('Id: ', this.id);
      Sql.query('SELECT * FROM users WHERE id=?;', [this.id], function(error, results, fields) {
        if (error) {
          console.error(error);
          callback('Failed to find user.', null);
        } else if (results.length > 0) {
          // console.log('Found user.');
          var user = results[0];
          delete user.password;
          callback(null, user);
        } else {
          console.log('Could not find user.');
          callback('Could not find user.', null);
        }
      });
    } else {
      console.log('Missing id for user.');
      callback('Missing id for user.', null);
    }
  }

  authenticate(callback) {
    var pw = this.password;
    Sql.query('SELECT * FROM users WHERE name = ?;', [this.name],
    function(error, results, fields) {
      if (error) {
        console.error(error);
        callback('Could not find user?', null);
      } else if (results.length > 0) {
        const auth = new Pasteurize(64, 256, 100000, 'sha512');
        var hash = results[0].password;
        var banned = results[0].banned;
        var user_id = results[0].id;
        var image = results[0].image;
        var name = results[0].name;
        var admin = results[0].admin;

        auth.verifyPassword(pw, hash, (error, isValid) => {
          if (error) {
            console.error(error);
            callback('Failed to authenticate user.', null);
          } else if (isValid) {
            if (!banned) {
              // console.log('User is active.');
              callback(null, {id:user_id, name:name, image:image, banned:banned, admin:admin});
            } else {
              console.log('User is banned.');
              callback('User is banned.', null);
            }
          } else {
            console.log('Wrong password.');
            callback('Wrong password.', null);
          }
        });
      } else {
        console.log('No matching user found.');
        callback('No matching user found.', null);
      }
    });
  }

  savePic(callback) {

    if (this.id !== 'undefined') {
      Sql.query('UPDATE users SET image = ? WHERE id = ?;', [this.image, this.id], function (error, results, fields) {
        if (error) {
          console.error(error);
          callback('Could not save user.', null);
        } else {
          console.log('Did save user: ', results.insertId);
          callback(null, results.insertId);
        }
      });
    }
  }

  save(callback) {
    console.log(this);
    if (this.name.length > 0) {

      if (typeof this.banned === 'undefined') {
        this.banned = false; // Only when created
      }
      console.log('Will save user: ', this.name);
      const auth = new Pasteurize(64, 256, 100000, 'sha512');
      auth.hashPassword(this.password, (error, hash) => {
        if (error) {
          console.error(error);
          callback('Could not save user.', null);
        } else {
          this.password = hash;
          Sql.query('INSERT INTO users SET ?;', this, function (error, results, fields) {
            if (error) {
              console.error(error);
              callback('Could not save user.', null);
            } else {
              console.log('Did save user: ', results.insertId);
              callback(null, results.insertId);
            }
          });
        }
      });
    } else {
      console.error('Cannot save user without name.');
      callback('Cannot save user without name.', null);
    }
  }

create(callback) {
    console.log(this);
    if (this.name.length > 0) {

      if (typeof this.banned === 'undefined') {
        this.banned = false; // Only when created
      }
      console.log('Will save user: ', this.name);
      const auth = new Pasteurize(64, 256, 100000, 'sha512');
      auth.hashPassword(this.password, (error, hash) => {
        if (error) {
          console.error(error);
          callback('Could not save Admin.', null);
        } else {
          this.password = hash;
          Sql.query('INSERT INTO users SET ?;', this, function (error, results, fields) {
            if (error) {
              console.error(error);
              callback('Could not save Admin.', null);
            } else {
              console.log('Did save Admin: ', results.insertId);
              callback(null, results.insertId);
            }
          });
        }
      });
    } else {
      console.error('Cannot save user without name.');
      callback('Cannot save user without name.', null);
    }
  }

  banUser(callback) {
    
      if (this.id !== 'undefined') {
      Sql.query('UPDATE users SET banned = ? WHERE id = ?;', [true, this.id], function (error, results, fields) {
        if (error) {
          console.error(error);
          callback('Could not ban user.', null);
        } else {
          console.log('Did save user: ', results.insertId);
          callback(null, results.insertId);
        }
      });
    }
  }
    
  update(callback) {
    // Remove properties that should not be updated
    delete this.password;
    delete this.banned;
    delete this.name;
    delete this.admin;
    // Perform query
    if (this.id !== 'undefined') {
      Sql.query('UPDATE users SET ? WHERE id=?;', [this, this.id], function (error, results, fields) {
        if (error) {
          console.error(error);
          callback('Could not update user.', null);
        } else {
          // console.log('Did update user.');
          callback(null, true);
        }
      });
    } else {
      console.log('No user id.');
      callback('No user id.', null);
    }
  }
}

module.exports = User;
