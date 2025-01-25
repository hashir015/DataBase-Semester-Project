const express = require('express');
const router = express.Router();
const sql = require('mssql');

// Get all travel packages
router.get('/', async (req, res) => {
    try {
        const result = await sql.query('SELECT * FROM TravelPackages');
        res.render('travelpackages/index', { travelPackages: result.recordset }); // Pass the correct variable
    } catch (err) {
        res.status(500).send('Error fetching travel packages: ' + err.message);
    }
});


// Show form to create a new travel package
router.get('/create', (req, res) => {
    res.render('travelpackages/create');
});

// Create a new travel package
router.post('/create', async (req, res) => {
    const { Package_Name, Package_Description, Price, Duration } = req.body;
    try {
        await sql.query`INSERT INTO TravelPackages (Package_Name, Package_Description, Price, Duration) 
                        VALUES (${Package_Name}, ${Package_Description}, ${Price}, ${Duration})`;
        res.redirect('/travel-packages');
    } catch (err) {
        res.status(500).send('Error creating travel package: ' + err.message);
    }
});

// Show form to edit a travel package
router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await sql.query`SELECT * FROM TravelPackages WHERE PackageID = ${id}`;
        res.render('travelpackages/edit', { travelPackage: result.recordset[0] });
    } catch (err) {
        res.status(500).send('Error fetching travel package: ' + err.message);
    }
});


// Update a travel package
router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { Package_Name, Package_Description, Price, Duration } = req.body;
    try {
        await sql.query`UPDATE TravelPackages 
                        SET Package_Name = ${Package_Name}, 
                            Package_Description = ${Package_Description}, 
                            Price = ${Price}, 
                            Duration = ${Duration} 
                        WHERE PackageID = ${id}`;
        res.redirect('/travel-packages');
    } catch (err) {
        res.status(500).send('Error updating travel package: ' + err.message);
    }
});

// Delete a travel package
router.post('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await sql.query`DELETE FROM TravelPackages WHERE PackageID = ${id}`;
        res.redirect('/travel-packages');
    } catch (err) {
        res.status(500).send('Error deleting travel package: ' + err.message);
    }
});

module.exports = router;
