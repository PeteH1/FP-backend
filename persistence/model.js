const { Sequelize, DataTypes } = require('sequelize');
const sequelize = new Sequelize('sqlite::memory:');

const test = sequelize.define("test", {
    name: {
        type: DataTypes.STRING,
        primaryKey: true
    }
}, {
    freezeTableName: true,
    timestamps: false,
    tableName: "testdb"
});


module.exports = { test }