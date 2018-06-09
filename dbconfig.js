module.exports = {
  app:{
    accessKey           : 'oZCq3CqRuK24Bt2txchdOuRHyw36eJ6hf1G1QENi'
  },
  db: {
    database            : process.env.RDS_DB_NAME  || 'dat076_db',
    host                : process.env.RDS_HOSTNAME || 'localhost',
    port                : process.env.RDS_PORT     || 3306,
    user                : process.env.RDS_USERNAME || 'root',
    password            : process.env.RDS_PASSWORD || 'root',
    multipleStatements  : true
  }
};
