//initialise Sequelize
const Sequelize = require('sequelize');

//read all files inside directory
const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);

//.env reader
require('dotenv').config();

//.env
const connection = {
    dialect : process.env.DIALECT,
    dialectModel : process.env.DIALECTMODEL,
    database : process.env.DATABASE_NAME,
    username : process.env.ADMIN_USERNAME,
    password : process.env.ADMIN_PASSWORD,
    host: process.env.HOST
}

// connect to db
const sequelize = new Sequelize(connection);

const db = {}
db.sequelize = sequelize

//And use them to read the models in the loop
fs.readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) &&
      (file.slice(-3) === '.js');
    })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize,
      Sequelize);
    db[model.name] = model;
      //console.log(db)
  });

//invoke the associate function if one is defined
Object.keys(db).forEach(modelName => {
if (db[modelName].associate) {
    db[modelName].associate(db);
}
});

module.exports = db