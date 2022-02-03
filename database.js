const Sequelize = require("sequelize");
require('dotenv').config();

//.git ignored the .env file have to add these in
const sequelize = new Sequelize(process.env.DB_DBNAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST, //aws instance link
    port: process.env.DB_PORT, 
    dialect: process.env.DB_DIALECT
});

sequelize.authenticate().then(() => {
    console.log("Connection successfull");
}).catch((error) => {
    console.log("Cant connect");
});

module.exports = sequelize;