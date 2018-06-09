
const config = require('../dbconfig');
module.exports = require('mysql').createConnection(config.db);
