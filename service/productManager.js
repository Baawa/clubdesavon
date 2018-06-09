const Product = require('../model/product');
const path = require('path');
const jwt = require('jsonwebtoken');
const config = require('../dbconfig');
const Sql = require('../SQL/APSql');

var create = (req, res, next) => {
  var product = new Product(req.body);

  product.save(function(error, id) {
    if (error) {
      res.status(400).send({'error':'Could not create product.'});
    } else {
      req.product_id = id;
      next();
    }
  });
};

var getProduct = (req, res, next) => {
  var product = new Product(req);
  product.id = req.product_id || req.params.product_id || req.body.product_id;

  product.get(function(error, p) {
    if (error) {
      res.status(400).send({'error':'Could not get product.'});
    } else {
      var product = new Product(p);
      product.id = p.id;

      req.product = product;

      next();
    }
  });
};

var getProducts = (req, res, next) => {
  var type = req.type || req.params.type || req.body.type;
  req.type = type; //ensure that we use the right parameter later.

  var query = "SELECT * FROM products;";

  if (typeof type !== 'undefined'){
    query = "SELECT * FROM products WHERE type=?;";
  }

  Sql.query(query, [type],
  function(error, results, fields) {
    if (error) {
      console.error(error);
      res.status(400).send({'error':error});
    } else {
      var products = [];

      for (var i = 0; i < results.length; i++){
        var product = new Product(results[i]);
        product.id = results[i].id; //for some reason id is not set in post.
        products.push(product);
      }

      req.products = products;
      next();
    }
  });
};

var createDefaultProducts = (req, res, next) => {
  var product1 = new Product();
  product1.name = "Luxury Shampoo";
  product1.price = "250";
  product1.description = "The most luxurious shampoo ever created by mankind. No one and nothing is greater than this.";
  product1.smell = "Rose petals";
  product1.hairtype = "Fat";
  product1.cleansing = true;
  product1.volumizing = false;
  product1.image = "product1.jpg";
  product1.type = 1;

  product1.save(function(error, u) {
    if (error) {
      res.status(400).send({'error':'Could not save product.'});
    } else {
      var product2 = new Product();
      product2.name = "Excellent Conditioner";
      product2.price = "150";
      product2.description = "Conditioner used by his excellency himself.";
      product2.smell = "Perchament";
      product2.hairtype = "Dry";
      product2.cleansing = false;
      product2.volumizing = true;
      product2.image = "product2.jpg";
      product2.type = 2;

      product2.save(function(error, u) {
        if (error) {
          res.status(400).send({'error':'Could not save product.'});
        } else {
          var product3 = new Product();
          product3.name = "Mighty treatment";
          product3.price = "100kr";
          product3.description = "So mighty even the vikings learned to use it.";
          product3.smell = "Sandal";
          product3.hairtype = "Fat";
          product3.cleansing = false;
          product3.volumizing = false;
          product3.image = "product3.jpg";
          product3.type = 3;

          product3.save(function(error, u) {
            if (error) {
              res.status(400).send({'error':'Could not save product.'});
            } else {
              next();
            }
          });
        }
      });
    }
  });
};

module.exports = {
  create,
  getProduct,
  getProducts,
  createDefaultProducts
}
