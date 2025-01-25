const express = require('express');
const router = express.Router();
const sql = require('mssql');

// GET all tours
router.get('/', async (req, res) => {
    try {
        const result = await sql.query('SELECT * FROM Tours');
        res.render('tours/index', { tours: result.recordset });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// GET form to create a new tour
router.get('/create', (req, res) => {
    res.render('tours/create');
});

// POST create a new tour
router.post('/create', async (req, res) => {
    const { Tour_Name, Schedule, Tour_Location, Price, DestinationID, PackageID } = req.body;

    // Log incoming data to check if it's being received correctly
    console.log("Received Data:", { Tour_Name, Schedule, Tour_Location, Price, DestinationID, PackageID });

    try {
        // Parameterized query to insert the new tour into the database
        await sql.query(`
            INSERT INTO Tours (Tour_Name, Schedule, Tour_Location, Price, DestinationID, PackageID) 
            VALUES (@Tour_Name, @Schedule, @Tour_Location, @Price, @DestinationID, @PackageID)
        `, {
            Tour_Name: Tour_Name,
            Schedule: new Date(Schedule), // Convert Schedule to valid Date object
            Tour_Location: Tour_Location,
            Price: parseFloat(Price), // Ensure Price is decimal
            DestinationID: parseInt(DestinationID), // Convert to integer
            PackageID: parseInt(PackageID) // Convert to integer
        });

        console.log('Tour created successfully');  // Debugging log

        res.redirect('/tours');
    } catch (err) {
        console.error('Error:', err);  // Log the exact error for debugging
        res.status(500).send('Internal Server Error');
    }
});




// GET form to edit a tour
router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await sql.query`SELECT * FROM Tours WHERE TourID = ${id}`;
        res.render('tours/edit', { tour: result.recordset[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

// POST update a tour
// POST update a tour
router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { Tour_Name, Schedule, Tour_Location, Price } = req.body;

    try {
        // Ensure Schedule is properly formatted
        const formattedSchedule = new Date(Schedule).toISOString(); // Convert to ISO string for SQL compatibility

        const query = `
            UPDATE Tours
            SET 
                Tour_Name = @Tour_Name,
                Schedule = @Schedule,
                Tour_Location = @Tour_Location,
                Price = @Price
            WHERE TourID = @TourID
        `;

        const request = new sql.Request();
        request.input('Tour_Name', sql.NVarChar, Tour_Name);
        request.input('Schedule', sql.DateTime, formattedSchedule);
        request.input('Tour_Location', sql.NVarChar, Tour_Location);
        request.input('Price', sql.Decimal(10, 2), Price);
        request.input('TourID', sql.Int, id);

        // Execute the query
        await request.query(query);
        res.redirect('/tours');
    } catch (err) {
        console.error('Error:', err);  // Log the exact error for debugging
        res.status(500).send('Internal Server Error');
    }
});


// POST delete a tour
router.post('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await sql.query`DELETE FROM Tours WHERE TourID = ${id}`;
        res.redirect('/tours');
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;