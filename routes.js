const { response } = require('express');
const res = require('express/lib/response');
const sequelise = require('./database.js');

const router = require('express').Router();
const sequelize = require('./database.js');

// router.get('/readAll', async (req, res, next) => {
//     const data = await sequelize.query('SELECT * FROM DBFinalProj.anprcamera', { type: sequelize.QueryTypes.SELECT })
//     console.log(data);
// })


//READ ALL DATA IN A TABLE
router.get('/readAll', async (req, res, next) => {
    await sequelize.query('SELECT * FROM DBFinalProj.anprcamera LIMIT 10', { type: sequelize.QueryTypes.SELECT })
        .then((result) => {
            res.status(201).send(result);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message || "An error occcurred while retrieving data"
            });
        });
});

//READ WITH ENTERY LIKE WHAT IS SEARCHED FOR 
router.get(`/streetName/:search`, async (req, res, next) => {
    const search = req.params.search;
    await sequelize.query(`SELECT * FROM DBFinalProj.anprcamera WHERE street_name LIKE :street_name LIMIT 10;`, {replacements: { street_name: `%${search}%` } , type: sequelize.QueryTypes.SELECT }) //TYPE: INCLUDED AS WILL DOUBLE THE RETURNED RESULTS FOR WHATEVER REASON
        .then((result) => {
            res.status(201).send(result);
        })
        .catch((err) => {
            res.status(500).send({
                message:
                    err.message || "An error occcurred while retrieving data"
            });
        });
});

module.exports = router;