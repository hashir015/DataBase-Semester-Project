const express = require('express');
const sql = require('mssql');
const router = express.Router();

// Fetch all coupons
router.get('/', async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM Coupons`;
        res.render('coupons/index', { coupons: result.recordset });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving coupons');
    }
});

router.get('/create', async (req, res) => {
    try {
        // Fetch customers from the database
        const result = await sql.query`SELECT CustomerID, Cust_Name FROM Customers`;
        const customers = result.recordset;

        // Check if customers were fetched successfully
        console.log('Fetched customers:', customers); // Debugging log

        // Render the create.ejs page with fetched customers
        res.render('coupons/create', { customers });
    } catch (err) {
        console.error('Error fetching customers:', err);
        res.status(500).send('Error retrieving customers');
    }
});



// Handle create form submission
router.post('/create', async (req, res) => {
    const { Code, DiscountPercent, ExpiryDate, CustomerID } = req.body;

    try {
        // Insert into the Coupons table
        await sql.query`
            INSERT INTO Coupons (Code, DiscountPercent, ExpiryDate, CustomerID)
            VALUES (${Code}, ${DiscountPercent}, ${ExpiryDate}, ${CustomerID})
        `;
        res.redirect('/coupons'); // Redirect to the list of coupons
    } catch (err) {
        console.error('Error creating coupon:', err);
        res.status(500).send('Error creating coupon');
    }
});

// Render edit form
router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await sql.query`SELECT * FROM Coupons WHERE CouponID = ${id}`;
        res.render('coupons/edit', { coupon: result.recordset[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving coupon');
    }
});

// Handle edit form submission
router.post('/edit/:id', async (req, res) => {
    const { id } = req.params; // Extract the CouponID from the URL
    const { Code, DiscountPercent, ExpiryDate } = req.body; // Extract form values

    try {
        // Update the coupon in the database
        await sql.query`
            UPDATE Coupons
            SET 
                Code = ${Code}, 
                DiscountPercent = ${DiscountPercent}, 
                ExpiryDate = ${ExpiryDate}
            WHERE 
                CouponID = ${id}
        `;

        // Redirect to the coupons list after successful update
        res.redirect('/coupons');
    } catch (err) {
        console.error('Error updating coupon:', err); // Log the exact error for debugging
        res.status(500).send('Error updating coupon'); // Send user-friendly error message
    }
});


// Delete coupon
router.post('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await sql.query`DELETE FROM Coupons WHERE CouponID = ${id}`;
        res.redirect('/coupons');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting coupon');
    }
});

module.exports = router; 