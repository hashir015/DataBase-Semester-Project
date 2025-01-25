const express = require('express');
const router = express.Router();
const sql = require('mssql');

// GET all transport options
router.get('/', async (req, res) => {
    try {
        const result = await sql.query('SELECT * FROM Transport');
        res.render('transport/index', { transports: result.recordset });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// GET form to create a new transport option
router.get('/create', (req, res) => {
    res.render('transport/create');
});

router.post('/create', async (req, res) => {
    const { Transport_Type, ProviderName, Cost, VendorID, PackageID } = req.body; // Adjusted field names
    try {
        await sql.query`
            INSERT INTO Transport (Transport_Type, ProviderName, Cost, VendorID, PackageID) 
            VALUES (${Transport_Type}, ${ProviderName}, ${Cost}, ${VendorID}, ${PackageID})
        `;
        res.redirect('/transport');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


// GET form to edit a transport option
router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await sql.query`SELECT * FROM Transport WHERE TransportID = ${id}`;
        res.render('transport/edit', { transport: result.recordset[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// POST update a transport option
router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { Transport_Type, ProviderName, Cost, VendorID, PackageID } = req.body;
    try {
        await sql.query`
            UPDATE Transport
            SET 
                Transport_Type = ${Transport_Type},
                ProviderName = ${ProviderName},
                Cost = ${Cost},
                VendorID = ${VendorID},
                PackageID = ${PackageID}
            WHERE TransportID = ${id}
        `;
        res.redirect('/transport');
    } catch (err) {
        console.error("Error updating transport:", err);
        res.status(500).send('Internal Server Error');
    }
});


// POST delete a transport option
router.post('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await sql.query`DELETE FROM Transport WHERE TransportID = ${id}`;
        res.redirect('/transport');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;