// routes/destinations.js
const express = require('express');
const router = express.Router();
const sql = require('mssql');

// Fetch all destinations
router.get('/', async (req, res) => {
    try {
        const result = await sql.query('SELECT * FROM Destinations');
        res.render('destinations/index', { destinations: result.recordset });
    } catch (err) {
        console.error('Error fetching destinations:', err);
        res.status(500).send('Error fetching destinations.');
    }
});

// Show form to create a new destination
router.get('/create', async (req, res) => {
    try {
        // Fetch available packages for the dropdown
        const result = await sql.query('SELECT * FROM TravelPackages');
        res.render('destinations/create', { packages: result.recordset });
    } catch (err) {
        console.error('Error fetching travel packages:', err);
        res.status(500).send('Error fetching travel packages.');
    }
});

// Handle destination creation
router.post('/create', async (req, res) => {
    const { Country, City, Destination_Description, PackageID } = req.body;
    try {
        await sql.query`INSERT INTO Destinations (Country, City, Destination_Description, PackageID) 
                        VALUES (${Country}, ${City}, ${Destination_Description}, ${PackageID})`;
        res.redirect('/destinations');
    } catch (err) {
        console.error('Error creating destination:', err);
        res.status(500).send('Error creating destination.');
    }
});

// Show form to edit a destination
router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await sql.query`SELECT * FROM Destinations WHERE DestinationID = ${id}`;
        if (result.recordset.length === 0) {
            res.status(404).send('Destination not found.');
        } else {
            res.render('destinations/edit', { destination: result.recordset[0] });
        }
    } catch (err) {
        console.error('Error fetching destination:', err);
        res.status(500).send('Error fetching destination.');
    }
});

// Handle destination update
router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { Country, City, Destination_Description } = req.body;
    try {
        await sql.query`UPDATE Destinations SET Country = ${Country}, City = ${City}, Destination_Description = ${Destination_Description} WHERE DestinationID = ${id}`;
        res.redirect('/destinations');
    } catch (err) {
        console.error('Error updating destination:', err);
        res.status(500).send('Error updating destination.');
    }
});

// Handle destination deletion
router.post('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await sql.query`DELETE FROM Destinations WHERE DestinationID = ${id}`;
        res.redirect('/destinations');
    } catch (err) {
        console.error('Error deleting destination:', err);
        res.status(500).send('Error deleting destination.');
    }
});

module.exports = router;
