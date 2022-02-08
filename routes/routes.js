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
        const bioInfo = await sequelize.query(`SELECT * FROM DBFinalProj.citizen where forenames like ? and surname = ?; `, { replacements: [`%${firstName}%`, surname], type: sequelize.QueryTypes.SELECT })
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
        const citizenPassport = await sequelize.query(

            `SELECT c.citizen_id, c.forenames, c.surname, c.home_address, c.date_of_birth, c.place_of_birth, c.sex, p.passport_number, p.nationality, p.issuing_country, p.date_of_issue, p.date_of_expiry
            FROM DBFinalProj.citizen c 
            JOIN DBFinalProj.passport p ON c.forenames=p.given_name AND c.surname=p.surname AND c.date_of_birth = p.dob
            WHERE c.citizen_id=?;`, { replacements: citizenId, type: sequelize.QueryTypes.SELECT })

        const callsReceived = await sequelize.query(

            `SELECT mcr.timestamp, mcr.caller_msisdn, mcr.receiver_msisdn, ct.latitude, ct.longitude FROM DBFinalProj.mobilecallrecords mcr
            JOIN DBFinalProj.celltower ct ON mcr.receiver_tower_id=ct.cell_tower_id
            WHERE mcr.receiver_msisdn=(SELECT phone_number FROM DBFinalProj.peoplemobile pm 
            JOIN DBFinalProj.citizen c ON c.forenames=pm.forenames AND c.surname=pm.surname AND c.date_of_birth=pm.date_of_birth AND c.home_address=pm.address
            WHERE citizen_id=?)
            GROUP BY timestamp ORDER BY timestamp desc;`, { replacements: citizenId, type: sequelize.QueryTypes.SELECT })

        const callsMade = await sequelize.query(

            `SELECT mcr.timestamp, mcr.caller_msisdn, mcr.receiver_msisdn, ct.latitude, ct.longitude FROM DBFinalProj.mobilecallrecords mcr
            JOIN DBFinalProj.celltower ct ON mcr.call_cell_tower_id=ct.cell_tower_id
            WHERE mcr.caller_msisdn=(SELECT phone_number FROM DBFinalProj.peoplemobile pm 
            JOIN DBFinalProj.citizen c ON c.forenames=pm.forenames AND c.surname=pm.surname AND c.date_of_birth=pm.date_of_birth AND c.home_address=pm.address
            WHERE citizen_id=?)
            GROUP BY timestamp ORDER BY timestamp desc;`, { replacements: citizenId, type: sequelize.QueryTypes.SELECT })

        const anprSightings = await sequelize.query(

            `SELECT vo.vehicle_registration_no, vr.make, vr.model, vr.colour, vo.timestamp, a.latitude, a.longitude FROM DBFinalProj.vehicleobservations vo
            JOIN DBFinalProj.anprcamera a ON vo.anpr_point_id = a.anpr_id
            JOIN DBFinalProj.vehicleregistration vr ON vo.vehicle_registration_no = vr.vehicle_registration_no
            JOIN DBFinalProj.citizen c ON c.forenames = vr.forenames AND c.surname = vr.surname AND c.home_address = vr.address AND c.date_of_birth = vr.date_of_birth
            WHERE c.citizen_id=?;`, { replacements: citizenId, type: sequelize.QueryTypes.SELECT })

        const eposTransactions = await sequelize.query(

            `SELECT pba.forenames, pba.surname, pba.account_number, pba.bank, bc.sort_code, epost.bank_card_number, epost.timestamp, epost.payee_account, epost.amount,
            epos.vendor, epos.street_name, epos.postcode, epos.latitude, epos.longitude FROM DBFinalProj.citizen c
            JOIN DBFinalProj.peoplebankaccount pba ON c.forenames=pba.forenames AND c.surname=pba.surname AND c.home_address=pba.home_address AND c.date_of_birth=pba.date_of_birth
            JOIN DBFinalProj.bankcard bc ON pba.account_number=bc.account_number
            JOIN DBFinalProj.epostransactions epost ON bc.card_number=epost.bank_card_number
            JOIN DBFinalProj.epos ON epost.epos_id=epos.id
            WHERE c.citizen_id=?;`, { replacements: citizenId, type: sequelize.QueryTypes.SELECT })

        const atmTransactions = await sequelize.query(

            `SELECT pba.forenames, pba.surname, pba.account_number, pba.bank, bc.sort_code, atmt.bank_card_number, atmt.timestamp, atmt.type, atmt.amount,
            atmp.operator, atmp.street_name, atmp.postcode, atmp.latitude, atmp.longitude FROM DBFinalProj.peoplebankaccount pba
            JOIN DBFinalProj.citizen c ON c.forenames=pba.forenames AND c.surname=pba.surname AND c.home_address=pba.home_address AND c.date_of_birth=pba.date_of_birth
            JOIN DBFinalProj.bankcard bc ON pba.account_number=bc.account_number
            JOIN DBFinalProj.atmtransaction atmt ON bc.card_number=atmt.bank_card_number
            JOIN DBFinalProj.atmpoint atmp ON atmt.atm_id=atmp.atm_id
            WHERE c.citizen_id=?;`, { replacements: citizenId, type: sequelize.QueryTypes.SELECT })

        const eposTransactions = await sequelize.query(

            ``, { replacements: citizenId, type: sequelize.QueryTypes.SELECT })

        res.status(201).send({ citizenPassport, callsReceived, callsMade, anprSightings, eposTransactions, atmTransactions });

    } catch (error) {
        res.status(500).send({
            message:
                error.message || "An error occcurred while retrieving data"

        });
    };
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