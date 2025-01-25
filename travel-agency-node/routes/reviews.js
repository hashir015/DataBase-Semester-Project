// Step 1: Create reviewsRouter in routes/reviews.js

const express = require('express');
const sql = require('mssql');
const router = express.Router();

// GET all reviews
router.get('/', async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM Reviews`;
        res.render('reviews/index', { reviews: result.recordset });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// GET form to create a new review
router.get('/create', (req, res) => {
    res.render('reviews/create');
});

// In the routes for creating and editing reviews:
router.post('/create', async (req, res) => {
    const { CustomerID, Comments, Rating, ServiceType } = req.body;
    try {
        await sql.query`
            INSERT INTO Reviews (CustomerID, Comments, Rating, ServiceType)
            VALUES (${CustomerID}, ${Comments}, ${Rating}, ${ServiceType})
        `;
        res.redirect('/reviews');
    } catch (err) {
        console.error('Error:', err);  // Log the error message
        res.status(500).send(`Server Error: ${err.message}`);
    }
});


// GET form to edit a review
router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await sql.query`SELECT * FROM Reviews WHERE ReviewID = ${id}`;
        if (result.recordset.length === 0) {
            return res.status(404).send('Review not found');
        }
        // Ensure review data is passed correctly to the view
        res.render('reviews/edit', { review: result.recordset[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});


// POST update a review
router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { CustomerID, Comments, Rating, ServiceType } = req.body;
    try {
        await sql.query`
            UPDATE Reviews
            SET CustomerID = ${CustomerID}, Comments = ${Comments}, Rating = ${Rating}, ServiceType = ${ServiceType}
            WHERE ReviewID = ${id}
        `;
        res.redirect('/reviews');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// POST delete a review
router.post('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await sql.query`DELETE FROM Reviews WHERE ReviewID = ${id}`;
        res.redirect('/reviews');
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
