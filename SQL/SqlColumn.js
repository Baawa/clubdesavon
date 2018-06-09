
'use strict';

class SqlColumn {

  constructor(name, type, properties) {
    this.statement = '';
    if (name != null) {
      this.statement += name;
    }
    if (type != null) {
      this.statement += ' ' + type;
    } else {
      this.statement += ' ' + SqlColumn.Type.VARCHAR;
    }
    if (properties != null) {
      if (Array.isArray(properties)) {
        for (var i=0; i<properties.length; i++) {
          // console.log('Column property array: ', properties[i]);
          this.statement += ' ' + properties[i];
        }
      } else if (typeof properties === 'string') {
        this.statement += ' ' + properties;
      }
    }
  }
}

SqlColumn.Type = {
  ID          : 'INT NOT NULL AUTO_INCREMENT PRIMARY KEY',
  INT         : 'INT',
  VARCHAR     : 'VARCHAR(255)',
  VARCHAR_511 : 'VARCHAR(511)',
  LONGTEXT    : 'LONGTEXT',
  NUMBER      : 'DOUBLE',
  BOOL        : 'BOOLEAN',
  DATE        : 'DATETIME'
};

SqlColumn.Property = {
  UNIQUE          : 'UNIQUE',
  NOT_NULL        : 'NOT NULL',
  AUTO_INCREMENT  : 'AUTO_INCREMENT',
  PRIMARY_KEY     : 'PRIMARY KEY'
};

module.exports = SqlColumn;
