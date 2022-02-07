// const { response } = require('express');
// const res = require('express/lib/response');
// const sequelize = require('../DBConfig/database.js');

const router = require('express').Router();
const sequelize = require('../DBConfig/database.js');

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
    await sequelize.query(`SELECT * FROM DBFinalProj.anprcamera WHERE street_name LIKE :street_name LIMIT 10;`, { replacements: { street_name: `%${search}%` }, type: sequelize.QueryTypes.SELECT }) //TYPE: INCLUDED AS WILL DOUBLE THE RETURNED RESULTS FOR WHATEVER REASON
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

router.get(`/name/:forename`, async (req, res, next) => {
    const { forename } = req.params;
    await sequelize.query(`SELECT * FROM DBFinalProj.citizen WHERE forenames LIKE ?;`, { replacements: [forename], type: sequelize.QueryTypes.SELECT }) //TYPE: INCLUDED AS WILL DOUBLE THE RETURNED RESULTS FOR WHATEVER REASON
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

router.get(`/PeteHutchison`, async (req, res, next) => {
    // const name = req.params.forename;
    try {
        const bioinfo = await sequelize.query(`SELECT * FROM DBFinalProj.citizen WHERE forenames='Peter' AND surname='Hutchison';`, { type: sequelize.QueryTypes.SELECT }); //TYPE: INCLUDED AS WILL DOUBLE THE RETURNED RESULTS FOR WHATEVER REASON
        const transactions = await sequelize.query(`SELECT p.forenames, p.surname, ep.vendor, b.card_number, p.home_address, e.bank_card_number FROM DBFinalProj.peoplebankaccount p
            JOIN DBFinalProj.bankcard b ON p.account_number = b.account_number
            JOIN DBFinalProj.epostransactions e ON b.card_number = e.bank_card_number
            JOIN DBFinalProj.epos ep ON ep.id = e.epos_id
            WHERE p.forenames = 'peter' and p.surname = 'hutchison';`, { type: sequelize.QueryTypes.SELECT });
        const calls = await sequelize.query(`SELECT timestamp, caller_msisdn, receiver_msisdn FROM DBFinalProj.mobilecallrecords WHERE caller_msisdn=(SELECT phone_number FROM DBFinalProj.peoplemobile WHERE forenames='Peter' AND surname='Hutchison')
            OR receiver_msisdn=(SELECT phone_number FROM DBFinalProj.peoplemobile WHERE forenames='Peter' AND surname='Hutchison')
            GROUP BY timestamp ORDER BY timestamp desc;`, { type: sequelize.QueryTypes.SELECT });
        res.send({ bioinfo, transactions, calls });
    } catch (error) {
        res.status(500).send({
            message:
                error.message || "An error occcurred while retrieving data"
        });
    }
    // .then((result) => {
    //     res.status(201).send(result);
    // })
    // .catch((err) => {
    //     res.status(500).send({
    //         message:
    //             err.message || "An error occcurred while retrieving data"
    //     });
    // });
});






module.exports = router;