const express = require('express');
const router = express.Router();
const sql = require('mssql');

// Get all customers
router.get('/', async (req, res) => {
    try {
        const result = await sql.query('SELECT * FROM Customers');
        res.render('customers/index', { customers: result.recordset });
    } catch (err) {
        res.status(500).send('Error fetching customers: ' + err.message);
    }
});

// Show form to create a new customer
router.get('/create', (req, res) => {
    res.render('customers/create');
});

// Create a new customer
router.post('/create', async (req, res) => {
    const { Cust_Name, Email, Phone, Cust_Address, DateOfRegistration } = req.body;
    console.log("body ", req.body);
    
    try {
        await sql.query`INSERT INTO Customers (Cust_Name, Email, Phone, Cust_Address, DateOfRegistration) 
                        VALUES ( ${Cust_Name}, ${Email}, ${Phone}, ${Cust_Address}, ${DateOfRegistration})`;
        res.redirect('/customers');
    } catch (err) {
        res.status(500).send('Error creating customer: ' + err.message);
    }
});

// Show form to edit a customer
router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await sql.query`SELECT * FROM Customers WHERE CustomerID = ${id}`;
        res.render('customers/edit', { customer: result.recordset[0] });
    } catch (err) {
        res.status(500).send('Error fetching customer: ' + err.message);
    }
});

// Update a customer
router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { Cust_Name, Email, Phone, Cust_Address, DateOfRegistration } = req.body;
    try {
        await sql.query`UPDATE Customers SET Cust_Name = ${Cust_Name}, Email = ${Email}, Phone = ${Phone}, 
                        Cust_Address = ${Cust_Address}, DateOfRegistration = ${DateOfRegistration} 
                        WHERE CustomerID = ${id}`;
        res.redirect('/customers');
    } catch (err) {
        res.status(500).send('Error updating customer: ' + err.message);
    }
});

// Delete a customer
router.post('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await sql.query`DELETE FROM Customers WHERE CustomerID = ${id}`;
        res.redirect('/customers');
    } catch (err) {
        res.status(500).send('Error deleting customer: ' + err.message);
    }
});

module.exports = router;
