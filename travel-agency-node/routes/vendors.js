const express = require('express');
const sql = require('mssql');
const router = express.Router();

// Fetch all vendors
router.get('/', async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM Vendors`;
        res.render('vendors/index', { vendors: result.recordset });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving vendors');
    }
});

// Render create form
router.get('/create', (req, res) => {
    res.render('vendors/create');
});

// Handle create form submission
router.post('/create', async (req, res) => {
    const { Vendor_Name, Contact, ServiceType } = req.body;
    try {
        await sql.query`
            INSERT INTO Vendors (Vendor_Name, Contact, ServiceType)
            VALUES (${Vendor_Name}, ${Contact}, ${ServiceType})
        `;
        res.redirect('/vendors');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating vendor');
    }
});

// Render edit form
router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await sql.query`SELECT * FROM Vendors WHERE VendorID = ${id}`;
        res.render('vendors/edit', { vendor: result.recordset[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving vendor');
    }
});

// Handle edit form submission
router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { Vendor_Name, Contact, ServiceType } = req.body;
    try {
        await sql.query`
            UPDATE Vendors
            SET Vendor_Name = ${Vendor_Name}, Contact = ${Contact}, ServiceType = ${ServiceType}
            WHERE VendorID = ${id}
        `;
        res.redirect('/vendors');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating vendor');
    }
});

// Delete vendor
router.post('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await sql.query`DELETE FROM Vendors WHERE VendorID = ${id}`;
        res.redirect('/vendors');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting vendor');
    }
});

module.exports = router;
