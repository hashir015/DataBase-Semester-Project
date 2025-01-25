const express = require('express');
const sql = require('mssql');
const router = express.Router();

// Fetch all staff
router.get('/', async (req, res) => {
    try {
        const result = await sql.query`SELECT * FROM Staff`;
        res.render('staff/index', { staff: result.recordset });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving staff');
    }
});

// Render create form
router.get('/create', (req, res) => {
    res.render('staff/create');
});

router.post('/create', async (req, res) => {
    const { Name, Role, Contact, Salary, VendorID } = req.body;
    try {
        await sql.query`
            INSERT INTO Staff (Staff_Name, Staff_Role, Contact, Salary, VendorID)
            VALUES (${Name}, ${Role}, ${Contact}, ${Salary}, ${VendorID})
        `;
        res.redirect('/staff');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error creating staff member');
    }
});



// Render edit form for staff member
router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await sql.query`SELECT * FROM Staff WHERE StaffID = ${id}`;
        if (result.recordset.length === 0) {
            return res.status(404).send('Staff member not found');
        }
        res.render('staff/edit', { staff: result.recordset[0] });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving staff member');
    }
});


// Handle edit form submission
router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { Name, Role, Contact, Salary, VendorID } = req.body;

    try {
        // Corrected the query to update all relevant fields
        await sql.query`
            UPDATE Staff
            SET Staff_Name = ${Name}, Staff_Role = ${Role}, Contact = ${Contact}, Salary = ${Salary}, VendorID = ${VendorID}
            WHERE StaffID = ${id}
        `;
        res.redirect('/staff');
    } catch (err) {
        console.error('Error:', err.message); // Log the error message
        res.status(500).send('Error updating staff member');
    }
});

// Delete staff member
router.post('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await sql.query`DELETE FROM Staff WHERE StaffID = ${id}`;
        res.redirect('/staff');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error deleting staff member');
    }
});

module.exports = router;
