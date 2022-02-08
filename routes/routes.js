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
// router.get('/:name', async (req, res, next) => {

//     const firstName = req.params.name.split(' ')[0];
//     const surname = req.params.name.split(' ')[1];

//     await sequelize.query(`SELECT * FROM DBFinalProj.citizen where forenames like ? and surname = ?; `, { replacements: [`%${firstName}%`, surname],  type: sequelize.QueryTypes.SELECT })
//         .then((result) => {
//             res.status(201).send(result); 
//         })
//         .catch((err) => {
//             res.status(500).send({
//                 message:
//                     err.message || "An error occcurred while retrieving data"
//             });
//         });
// });


router.get(`/:name`, async (req, res, next) => {
    const firstName = req.params.name.split(' ')[0];
    const surname = req.params.name.split(' ')[1];
    try {
        const bioInfo = await sequelize.query(`SELECT * FROM DBFinalProj.citizen where forenames like ? and surname = ?; `, { replacements: [`%${firstName}%`, surname],  type: sequelize.QueryTypes.SELECT })
        res.status(201).send(bioInfo);
    } catch (error) {
        res.status(500).send({
            message:
                error.message || "An error occcurred while retrieving data"
            });
        };
});

router.get(`/:citizenId`, async (req, res, next) => {

    const citizenId = req.params.citizenId;

    try {
        const a = await sequelize.query(
            
            `  ;`, { replacements: citizenId,  type: sequelize.QueryTypes.SELECT })

        const b = await sequelize.query(
            
            `  ;`, { replacements: citizenId,  type: sequelize.QueryTypes.SELECT })

        const c = await sequelize.query(
            
            `  ;`, { replacements: citizenId,  type: sequelize.QueryTypes.SELECT })

        const d = await sequelize.query(
            
            `  ;`, { replacements: citizenId,  type: sequelize.QueryTypes.SELECT })

        res.status(201).send({a, b, c, d});

    } catch (error) {
        res.status(500).send({
            message:
                error.message || "An error occcurred while retrieving data"
            });
        };
});


//SELECT c.citizen_id, c.forenames, c.surname, c.home_address, c.date_of_birth, c.place_of_birth, c.sex, p.passport_number, p.nationality, p.issuing_country, p.date_of_issue, p.date_of_expiry
// FROM DBFinalProj.citizen c
// JOIN DBFinalProj.passport p ON c.forenames=p.given_name AND c.surname=p.surname AND c.date_of_birth = p.dob
// WHERE c.citizen_id='2167989227';



// router.get('/:citizenId', async (req, res, next) => {

//     const citizenId = req.params.citizenId;

//     await sequelize.query(` `, { replacements: [],  type: sequelize.QueryTypes.SELECT })

//     await sequelize.query(` `, { replacements: [],  type: sequelize.QueryTypes.SELECT })

//     await sequelize.query(` `, { replacements: [],  type: sequelize.QueryTypes.SELECT })

//     await sequelize.query(` `, { replacements: [],  type: sequelize.QueryTypes.SELECT })
        
    
//     .then((result) => {
//             res.status(201).send(result); 
//         })
//         .catch((err) => {
//             res.status(500).send({
//                 message:
//                     err.message || "An error occcurred while retrieving data"
//             });
//         });
// });



//READ WITH ENTERY LIKE WHAT IS SEARCHED FOR 
// router.get(`/streetName/:search`, async (req, res, next) => {
//     const search = req.params.search;
//     await sequelize.query(`SELECT * FROM DBFinalProj.anprcamera WHERE street_name LIKE :street_name LIMIT 10;`, { replacements: { street_name: `%${search}%` }, type: sequelize.QueryTypes.SELECT }) //TYPE: INCLUDED AS WILL DOUBLE THE RETURNED RESULTS FOR WHATEVER REASON
//         .then((result) => {
//             res.status(201).send(result);
//         })
//         .catch((err) => {
//             res.status(500).send({
//                 message:
//                     err.message || "An error occcurred while retrieving data"
//             });
//         });
// });

// router.get(`/name/:forename`, async (req, res, next) => {
//     const name = req.params.forename;
//     await sequelize.query(`SELECT * FROM DBFinalProj.citizen WHERE forenames LIKE :forenames;`, { replacements: { forenames: `%${name}%` }, type: sequelize.QueryTypes.SELECT }) //TYPE: INCLUDED AS WILL DOUBLE THE RETURNED RESULTS FOR WHATEVER REASON
//         .then((result) => {
//             res.status(201).send(result);
//         })
//         .catch((err) => {
//             res.status(500).send({
//                 message:
//                     err.message || "An error occcurred while retrieving data"
//             });
//         });
// });


// router.get(`/PeteHutchison`, async (req, res, next) => {
//     // const name = req.params.forename;
//     const bioinfo = await sequelize.query(
//         `SELECT * FROM DBFinalProj.citizen WHERE forenames='Peter' AND surname='Hutchison';`, { type: sequelize.QueryTypes.SELECT }); //TYPE: INCLUDED AS WILL DOUBLE THE RETURNED RESULTS FOR WHATEVER REASON
    
//         const transactions = await sequelize.query(
//         `SELECT p.forenames, p.surname, ep.vendor, b.card_number, p.home_address, e.bank_card_number FROM DBFinalProj.peoplebankaccount p
//         JOIN DBFinalProj.bankcard b ON p.account_number = b.account_number
//         JOIN DBFinalProj.epostransactions e ON b.card_number = e.bank_card_number
//         JOIN DBFinalProj.epos ep ON ep.id = e.epos_id
//         WHERE p.forenames = 'peter' and p.surname = 'hutchison';`, { type: sequelize.QueryTypes.SELECT });

//     const calls = await sequelize.query(
//         `SELECT timestamp, caller_msisdn, receiver_msisdn 
//         FROM DBFinalProj.mobilecallrecords 
//         WHERE caller_msisdn=(SELECT phone_number FROM DBFinalProj.peoplemobile WHERE forenames='Peter' AND surname='Hutchison')
//         OR receiver_msisdn=(SELECT phone_number FROM DBFinalProj.peoplemobile WHERE forenames='Peter' AND surname='Hutchison')
//         GROUP BY timestamp ORDER BY timestamp desc;`, { type: sequelize.QueryTypes.SELECT });

//     const whereabouts = await sequelize.query(
//         `SELECT p.forenames, p.surname, ep.vendor, b.card_number, p.home_address, e.bank_card_number, atmt.bank_card_number
//         FROM DBFinalProj.peoplebankaccount p
//         JOIN DBFinalProj.bankcard b
//         ON p.account_number = b.account_number
//         JOIN DBFinalProj.epostransactions e
//         ON b.card_number = e.bank_card_number
//         JOIN DBFinalProj.epos ep
//         ON ep.id = e.epos_id
//         JOIN DBFinalProj.atmtransaction atmt
//         ON atmt.bank_card_number = b.card_number
//         JOIN DBFinalProj.atmpoint atmp
//         ON atmt.atm_id = atmp.atm_id
//         WHERE atmt.bank_card_number = '9854539636224593';`, { type: sequelize.QueryTypes.SELECT });
    
//     res.status(201).send({ bioinfo, transactions, calls, whereabouts })

    // .then((result) => {
    //     res.status(201).send(result);
    // })
    // .catch((err) => {
    //     res.status(500).send({
    //         message:
    //             err.message || "An error occcurred while retrieving data"
    //     });
    // });



module.exports = router;