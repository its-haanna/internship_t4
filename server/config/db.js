const mysql = require('mysql');

const db = mysql.createPool({
  host: 'eu-cdbr-west-03.cleardb.net',
  user: 'b319d74bcd1c38',
  password: 'ff81dbab',
  database: 'heroku_2ca833d14744c14'
});

module.exports = db;