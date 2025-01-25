const express = require('express');
const router = express.Router();
const sql = require('mssql');

// GET all hotels
router.get('/', async (req, res) => {
    try {
        // Select relevant fields from Hotels table
        const result = await sql.query`
            SELECT HotelID, Hotel_Name, Location, Rating, PackageID, VendorID
            FROM Hotels
        `;
        res.render('hotels/index', { hotels: result.recordset });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving hotels from the database.');
    }
});


// GET form to create a new hotel
router.get('/create', (req, res) => {
    res.render('hotels/create');
});

// POST create a new hotel
router.post('/create', async (req, res) => {
    const { Name, Location, Rating, VendorID, PackageID } = req.body;
    try {
        await sql.query`
            INSERT INTO Hotels (Hotel_Name, Location, Rating, VendorID, PackageID)
            VALUES (${Name}, ${Location}, ${Rating}, ${VendorID}, ${PackageID})
        `;
        res.redirect('/hotels');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating a new hotel.');
    }
});


// GET form to edit a hotel
router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await sql.query`
            SELECT HotelID, Hotel_Name, Location,  Rating, VendorID, PackageID
            FROM Hotels
            WHERE HotelID = ${id}
        `;

        if (result.recordset.length === 0) {
            return res.status(404).send('Hotel not found.');
        }

        const hotel = result.recordset[0];  // Get the hotel details from the query result
        res.render('hotels/edit', { hotel });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving hotel details.');
    }
});



// POST update a hotel
router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { Name, Location, Rating, VendorID, PackageID } = req.body;
    try {
        await sql.query`
            UPDATE Hotels
            SET Hotel_Name = ${Name}, Location = ${Location}, Rating = ${Rating}, VendorID = ${VendorID}, PackageID = ${PackageID}
            WHERE HotelID = ${id}
        `;
        res.redirect('/hotels');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating hotel.');
    }
});

// POST delete a hotel
router.post('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await sql.query`DELETE FROM Hotels WHERE HotelID = ${id}`;
        res.redirect('/hotels');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting hotel.');
    }
});

module.exports = router;