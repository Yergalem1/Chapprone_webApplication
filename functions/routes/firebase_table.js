const express = require('express');

const admin =require('firebase-admin');
const { Parser } = require('json2csv');
const fastCsv = require('fast-csv');


const router = express.Router();
const json2csvParser = new Parser({ header: true });

router.get('/all_broadcast_check', async function (req, res) {
    try {
        const db = admin.database();
    const ref = db.ref('/broadcasts_conversation');

   
        const snapshot = await ref.once('value');
        var result = snapshot.val();
        res.send({ data: result });

} catch (err) {
    res.status(500).send({ message: 'Something went wrong ' + err.message });
}
});


router.get('/broadcast', async function (req, res) {
    try {
        const db = admin.database();
    const ref = db.ref('/broadcasts');

   
        const snapshot = await ref.once('value');
        var result = snapshot.val();
        res.send({ data: result });

} catch (err) {
    res.status(500).send({ message: 'Something went wrong ' + err.message });
}
});
router.get('/chap_broadcasts_conversation', async function (req, res) {
    try {
        const db = admin.database();
    const ref = db.ref('/chapperones_broadcasts_conversation');

   
        const snapshot = await ref.once('value');
        var result = snapshot.val();
        res.send({ data: result });

} catch (err) {
    res.status(500).send({ message: 'Something went wrong ' + err.message });
}
})

    module.exports=router;