# FP-backend
Final Project back-end

DB_PASS=enter db password
DB_USER=enter db password user
DB_HOST= enter instance link
DB_DBNAME=enter db name
DB_PORT=enter port number
DB_DIALECT=dialect

const sequelize = new Sequelize(process.env.DB_DBNAME, process.env.DB_USER, process.env.DB_PASS, {
    host: process.env.DB_HOST, //aws instance link
    port: process.env.DB_PORT, 
    dialect: process.env.DB_DIALECT
});

either replace fields with correct info to info in brackets to connect to instance

OR

npm i dotenv and add make sure database.js has require('dotenv').config(); included. Make a file called .env and copy the file with the correct info.
