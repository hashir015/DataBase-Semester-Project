// routes/flights.js
const express = require('express');
const router = express.Router();
const sql = require('mssql');

// Get all flights
router.get('/', async (req, res) => {
    try {
        const result = await sql.query('SELECT * FROM Flights');
        res.render('flights/index', { flights: result.recordset });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Render create flight form
router.get('/create', (req, res) => {
    res.render('flights/create');
});

// Create flight post handler
router.post('/create', async (req, res) => {
    const { Airline, FlightNumber, DepartureTime, ArrivalTime, Price, DestinationID, VendorID, PackageID } = req.body;
    
    try {
        // Parse the datetime strings into JavaScript Date objects
        const DepartureTimeParsed = new Date(DepartureTime);
        const ArrivalTimeParsed = new Date(ArrivalTime);

        // Validate if DestinationID, VendorID, and PackageID exist
        const checkDestination = await sql.query`SELECT 1 FROM Destinations WHERE DestinationID = ${DestinationID}`;
        const checkVendor = await sql.query`SELECT 1 FROM Vendors WHERE VendorID = ${VendorID}`;
        const checkPackage = await sql.query`SELECT 1 FROM TravelPackages WHERE PackageID = ${PackageID}`;

        // Handle missing or invalid IDs
        if (!checkDestination.recordset.length) {
            return res.status(400).send('Invalid DestinationID');
        }
        if (!checkVendor.recordset.length) {
            return res.status(400).send('Invalid VendorID');
        }
        if (!checkPackage.recordset.length) {
            return res.status(400).send('Invalid PackageID');
        }

        // Insert the flight record into the Flights table
        await sql.query`
            INSERT INTO Flights (Airline, FlightNumber, DepartureTime, ArrivalTime, Price, DestinationID, VendorID, PackageID)
            VALUES (${Airline}, ${FlightNumber}, ${DepartureTimeParsed}, ${ArrivalTimeParsed}, ${Price}, ${DestinationID}, ${VendorID}, ${PackageID})
        `;

        // Redirect to the flights index page after successful insertion
        res.redirect('/flights');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});



// Render edit flight form
router.get('/edit/:id', async (req, res) => {
    const flightId = req.params.id;

    try {
        // Fetch the flight data from the database
        const result = await sql.query`SELECT * FROM Flights WHERE FlightID = ${flightId}`;
        const flight = result.recordset[0];

        if (!flight) {
            return res.status(404).send('Flight not found');
        }

        // Fetch associated destination, vendor, and package data
        const destinationResult = await sql.query`SELECT * FROM Destinations WHERE DestinationID = ${flight.DestinationID}`;
        const vendorResult = await sql.query`SELECT * FROM Vendors WHERE VendorID = ${flight.VendorID}`;
        const packageResult = await sql.query`SELECT * FROM TravelPackages WHERE PackageID = ${flight.PackageID}`;

        // Pass data to the edit page
        res.render('flights/edit', {
            flight: flight,
            destination: destinationResult.recordset[0],
            vendor: vendorResult.recordset[0],
            travelPackage: packageResult.recordset[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Update the flight
router.post('/edit/:id', async (req, res) => {
    const flightId = req.params.id;
    const { Airline, FlightNumber, DepartureTime, ArrivalTime, Price, DestinationID, VendorID, PackageID } = req.body;

    try {
        // Parse the datetime values
        const DepartureTimeParsed = new Date(DepartureTime);
        const ArrivalTimeParsed = new Date(ArrivalTime);

        // Validate if DestinationID, VendorID, and PackageID exist
        const checkDestination = await sql.query`SELECT 1 FROM Destinations WHERE DestinationID = ${DestinationID}`;
        const checkVendor = await sql.query`SELECT 1 FROM Vendors WHERE VendorID = ${VendorID}`;
        const checkPackage = await sql.query`SELECT 1 FROM TravelPackages WHERE PackageID = ${PackageID}`;

        if (!checkDestination.recordset.length) {
            return res.status(400).send('Invalid DestinationID');
        }
        if (!checkVendor.recordset.length) {
            return res.status(400).send('Invalid VendorID');
        }
        if (!checkPackage.recordset.length) {
            return res.status(400).send('Invalid PackageID');
        }

        // Update the flight record
        await sql.query`
            UPDATE Flights
            SET Airline = ${Airline}, FlightNumber = ${FlightNumber}, DepartureTime = ${DepartureTimeParsed}, ArrivalTime = ${ArrivalTimeParsed}, Price = ${Price}, DestinationID = ${DestinationID}, VendorID = ${VendorID}, PackageID = ${PackageID}
            WHERE FlightID = ${flightId}
        `;

        res.redirect('/flights');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Delete a flight
router.post('/delete/:id', async (req, res) => {
    try {
        await sql.query`DELETE FROM Flights WHERE FlightID = ${req.params.id}`;
        res.redirect('/flights');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;