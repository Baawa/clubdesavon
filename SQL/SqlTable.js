
'use strict';

const Sql = require('./APSql');

class SqlTable {

  constructor(tableName) {
    this.tableName = tableName;
    this.columns = [];
  }

  setTableName(tableName) {
    this.tableName = tableName;
    this.columns = [];
  }

  // Parameter "column" must be DATSqlColumn
  addColumn(column) {
    this.columns.push(column.statement);
  }

  createStatement() {
    var statement = 'CREATE TABLE IF NOT EXISTS ' + this.tableName + ' (';
    var first = true;
    for (var i=0; i<this.columns.length; i++) {
      var column = this.columns[i];
      if (first) {
        first = false;
        statement += column;
      } else {
        statement += ', ' + column;
      }
    }
    statement += '); ';
    return statement;
  }

  beginTransaction() {
    console.log('Table transaction started.');
    this.transaction = 'START TRANSACTION; ';
  }

  save(callback) {
    var statement = this.createStatement()
    if (typeof this.transaction !== 'undefined') {
      this.transaction += statement;
    } else if (callback != null) {
      // console.log('Query: ', statement);
      Sql.query(statement, function(error, results, fields) {
        if (error) {
          console.log(error);
          callback('Failed to save table.', null);
        } else {
          console.log('Tabled saved.');
          callback(null, results);
        }
      });
    } else {
      console.log('Save called without transaction or callback!');
    }
  }

  delete(callback) {
    var statement = 'DELETE FROM ' + this.tableName + '; ';
    if (typeof this.transaction !== 'undefined') {
      this.transaction += statement;
    } else if (callback != null) {
      // console.log('Query: ', statement);
      Sql.query(statement, function(error, results, fields) {
        if (error) {
          console.log(error);
          callback('Failed to delete table.', null);
        } else {
          console.log('Table deleted.');
          callback(null, results);
        }
      });
    } else {
      console.log('Delete called without transaction or callback!');
    }
  }

  drop(callback) {
    var statement = 'DROP TABLE IF EXISTS ' + this.tableName + '; ';
    if (typeof this.transaction !== 'undefined') {
      this.transaction += statement;
    } else if (callback != null) {
      // console.log('Query: ', statement);
      Sql.query(statement, function(error, results, fields) {
        if (error) {
          console.log(error);
          callback('Failed to drop table.', null);
        } else {
          console.log('Table dropped.');
          callback(null, results);
        }
      });
    } else {
      console.log('Delete called without transaction or callback!');
    }
  }

  commit(callback) {
    if (typeof this.transaction !== 'undefined') {
      this.transaction += 'COMMIT;';
      // console.log('Transaction: ', this.transaction);
      var statement = this.transaction;
      delete this.transaction;
      Sql.query(statement, function(errors, results, fields) {
        if (errors) {
          console.log(errors);
          callback('Failed to commit transaction.', null);
        } else {
          console.log('Table transaction committed.');
          callback(null, results);
        }
        // Sql.end(); // Close connection
      });
    } else {
      callback('Transaction is undefined!', null);
    }
  }
}

module.exports = SqlTable;
