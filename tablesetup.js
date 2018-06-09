// Import
const Table = require('./SQL/SqlTable');
const Column = require('./SQL/SqlColumn');
const Sql = require('./SQL/APSql');
const config = require('./dbconfig');

// Sql setup
const createTables = (req, res, next) => {
  console.log('Will create tables...');
  var table = new Table('products');
  table.beginTransaction();

  // products table
  table.addColumn(new Column('id', Column.Type.ID, null));
  table.addColumn(new Column('name', null, Column.Property.UNIQUE));
  table.addColumn(new Column('price', null, null));
  table.addColumn(new Column('description', null, null));
  table.addColumn(new Column('smell', null, null));
  table.addColumn(new Column('hairtype', null, null));
  table.addColumn(new Column('cleansing', Column.Type.BOOL, null));
  table.addColumn(new Column('volumizing', Column.Type.BOOL, null));
  table.addColumn(new Column('image', null, null));
  table.addColumn(new Column('type', Column.Type.INT, null));
  table.save(null);

  // Commit transaction
  table.commit(function (error, result) {
    if (error) {
      res.status(500).send({'error':error});
    } else {
      // res.send({'result':true});
      next();
    }
  });
};

const deleteTables = (req, res, next) => {
  console.log('Will delete tables...');
  var table = new Table('products');
  table.beginTransaction();
  table.drop();
  /*table.setTableName('posts');
  table.drop();*/

  table.commit(function (error, result) {
    if (error) {
      res.status(500).send({'error':error});
    } else {
      // res.send({'result':true});
      next();
    }
  });
};

module.exports = {
  createTables,
  deleteTables
};
