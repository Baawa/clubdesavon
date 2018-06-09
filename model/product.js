'use strict';

// Import
const Sql = require('../SQL/APSql');

// Definition
class Product {
  constructor(blob) {
    var data = blob || {};
    if (typeof blob !== 'undefined') {
      // Default user
      if (typeof blob.product !== 'undefined') {
        if (typeof blob.product.id !== 'undefined') {
          this.id = blob.product.id;
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
    this.id = data.id;
    this.name = data.name || "";
    this.price = data.price || "";
    this.description = data.description || null;
    this.smell = data.smell || null;
    this.hairtype = data.hairtype || null;
    this.cleansing = data.cleansing || false;
    this.volumizing = data.volumizing || false;
    this.image = data.image || null;
    this.type = data.type || null;
  }

  get(callback) {
    if (typeof this.id !== 'undefined') {
      Sql.query('SELECT * FROM products WHERE id=?;', [this.id], function(error, results, fields) {
        if (error) {
          console.error(error);
          callback('Failed to find product.', null);
        } else if (results.length > 0) {
          var product = results[0];
          callback(null, product);
        } else {
          console.log('Could not find product.');
          callback('Could not find product.', null);
        }
      });
    } else {
      console.log('Missing id for product.');
      callback('Missing id for product.', null);
    }
  }

  save(callback) {
    if (this.name.length > 0) {
      Sql.query('INSERT INTO products SET ?;', this, function (error, results, fields) {
        if (error) {
          console.error(error);
          callback('Could not save product.', null);
        } else {
          console.log('Did save product: ', results.insertId);
          callback(null, results.insertId);
        }
      });
    } else {
      console.error('Cannot save product without name.');
      callback('Cannot save product without name.', null);
    }
  }

  update(callback){
    if (typeof this.id !== 'undefined'){
      Sql.query('UPDATE products SET ? WHERE id = ?;', [this, this.id], function (error, results, fields) {
        if (error) {
          console.error(error);
          callback('Could not save product.', null);
        } else {
          console.log('Did save product: ', results.insertId);
          callback(null, results.insertId);
        }
      });
    } else {
      console.error('Cannot save without product id.');
      callback('Cannot save without product id.', null);
    }
  }
}

module.exports = Product;
