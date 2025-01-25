const express = require('express');
const sql = require('mssql');
const router = express.Router();

// GET all hotel rooms
router.get('/', async (req, res) => {
    try {
        const result = await sql.query('SELECT * FROM HotelRooms');
        res.render('hotelrooms/index', { rooms: result.recordset });
    } catch (err) {
        console.error('Error retrieving hotel rooms:', err);
        res.status(500).send('Error retrieving hotel rooms');
    }
});

// GET form to create a new hotel room
router.get('/create', (req, res) => {
    res.render('hotelrooms/create');
});

// POST create a new hotel room
router.post('/create', async (req, res) => {
    const { RoomType, PricePerNight, HotelID, Room_Availability } = req.body;
    try {
        await sql.query`
            INSERT INTO HotelRooms (RoomType, PricePerNight, HotelID, Room_Availability)
            VALUES (${RoomType}, ${PricePerNight}, ${HotelID}, ${Room_Availability})
        `;
        res.redirect('/hotelrooms');
    } catch (err) {
        console.error('Error creating hotel room:', err);
        res.status(500).send('Error creating hotel room');
    }
});

// GET form to edit a hotel room
router.get('/edit/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await sql.query`SELECT * FROM HotelRooms WHERE RoomID = ${id}`;
        res.render('hotelrooms/edit', { room: result.recordset[0] });
    } catch (err) {
        console.error('Error retrieving hotel room:', err);
        res.status(500).send('Error retrieving hotel room');
    }
});

// POST update a hotel room
router.post('/edit/:id', async (req, res) => {
    const { id } = req.params;
    const { RoomType, PricePerNight, HotelID, Room_Availability } = req.body;
    try {
        await sql.query`
            UPDATE HotelRooms
            SET RoomType = ${RoomType}, PricePerNight = ${PricePerNight}, 
                HotelID = ${HotelID}, Room_Availability = ${Room_Availability}
            WHERE RoomID = ${id}
        `;
        res.redirect('/hotelrooms');
    } catch (err) {
        console.error('Error updating hotel room:', err);
        res.status(500).send('Error updating hotel room');
    }
});

// POST delete a hotel room
router.post('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await sql.query`DELETE FROM HotelRooms WHERE RoomID = ${id}`;
        res.redirect('/hotelrooms');
    } catch (err) {
        console.error('Error deleting hotel room:', err);
        res.status(500).send('Error deleting hotel room');
    }
});

module.exports = router;