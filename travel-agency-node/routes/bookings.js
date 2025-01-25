const express = require('express');
const sql = require('mssql');
const router = express.Router();

// Route to get all bookings
router.get('/', async (req, res) => {
    try {
        const result = await sql.query('SELECT * FROM Bookings');
        res.render('bookings/index', { bookings: result.recordset });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving bookings');
    }
});

// Route to show create booking form
router.get('/create', async (req, res) => {
    try {
        const customers = await sql.query('SELECT CustomerID, Cust_Name FROM Customers');
        res.render('bookings/create', { customers: customers.recordset });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving data');
    }
});

// Route to handle booking creation
router.post('/create', async (req, res) => {
    const { CustomerID, BookingDate, Booking_Status, TotalAmount } = req.body;

    try {
        await sql.query(
            `INSERT INTO Bookings (CustomerID, BookingDate, Booking_Status, TotalAmount)
             VALUES (${CustomerID}, '${BookingDate}', '${Booking_Status}', ${TotalAmount})`
        );
        res.redirect('/bookings');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating booking');
    }
});

// Route to show edit booking form
router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const booking = await sql.query(`SELECT * FROM Bookings WHERE BookingID = ${id}`);
        const customers = await sql.query('SELECT CustomerID, Cust_Name FROM Customers');
        res.render('bookings/edit', { booking: booking.recordset[0], customers: customers.recordset });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving data');
    }
});

// Route to handle booking update
router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { CustomerID, BookingDate, Booking_Status, TotalAmount } = req.body;

    try {
        await sql.query(
            `UPDATE Bookings
             SET CustomerID = ${CustomerID},
                 BookingDate = '${BookingDate}',
                 Booking_Status = '${Booking_Status}',
                 TotalAmount = ${TotalAmount}
             WHERE BookingID = ${id}`
        );
        res.redirect('/bookings');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating booking');
    }
});

// Route to delete a booking
router.post('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        await sql.query(`DELETE FROM Bookings WHERE BookingID = ${id}`);
        res.redirect('/bookings');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting booking');
    }
});

module.exports = router;
