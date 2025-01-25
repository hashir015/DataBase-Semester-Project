// routes/payments.js

const express = require('express');
const router = express.Router();
const sql = require('mssql');

// Get all payments
router.get('/', async (req, res) => {
    try {
        const result = await sql.query('SELECT * FROM Payments');
        res.render('payments/index', { payments: result.recordset });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving payments');
    }
});

// Render create payment form
router.get('/create', (req, res) => {
    res.render('payments/create');
});

// Create a new payment
router.post('/create', async (req, res) => {
    const { Amount, PaymentMethod, BookingID, PaymentDate, PaymentStatus } = req.body;
    try {
        await sql.query`
            INSERT INTO Payments (Amount, PaymentMethod, BookingID, PaymentDate, Payment_Status) 
            VALUES (${Amount}, ${PaymentMethod}, ${BookingID}, ${PaymentDate}, ${PaymentStatus})
        `;
        res.redirect('/payments');
    } catch (err) {
        console.error('Error:', err.message); // Log error message
        res.status(500).send('Error creating payment');
    }
});


// Render edit payment form
router.get('/edit/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const result = await sql.query`SELECT * FROM Payments WHERE PaymentID = ${id}`;
        if (result.recordset.length === 0) {
            return res.status(404).send('Payment not found');
        }
        res.render('payments/edit', { payment: result.recordset[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving payment');
    }
});

// Update payment
router.post('/edit/:id', async (req, res) => {
    const id = req.params.id;
    const { Amount, PaymentMethod, BookingID } = req.body;
    try {
        await sql.query`UPDATE Payments SET Amount = ${Amount}, PaymentMethod = ${PaymentMethod}, BookingID = ${BookingID} WHERE PaymentID = ${id}`;
        res.redirect('/payments');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error updating payment');
    }
});

// Delete payment
router.post('/delete/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await sql.query`DELETE FROM Payments WHERE PaymentID = ${id}`;
        res.redirect('/payments');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting payment');
    }
});

module.exports = router;