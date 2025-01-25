require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
const path = require('path');
const customerRoutes = require('./routes/customers');
const bookingsRouter = require('./routes/bookings');
const travelPackagesRouter = require('./routes/travelpackages');
const destinationsRouter = require('./routes/destinations');
const flightsRouter = require('./routes/flights');
const hotelsRouter = require('./routes/hotels');
const hotelRoomsRouter = require('./routes/hotelrooms');
const toursRouter = require('./routes/tours');
const transportRouter = require('./routes/transport');
const paymentsRouter = require('./routes/payments');
const staffRouter = require('./routes/staff');
const vendorsRouter = require('./routes/vendors');
const reviewsRouter = require('./routes/reviews');
const couponsRouter = require('./routes/coupons');
const complexQueriesRouter = require('./routes/complexQueries');
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    database: process.env.DB_DATABASE,
    port: 1433,
    options: {
        encrypt: true,
        trustServerCertificate: true,
    },
};
sql.connect(dbConfig)
    .then(() => console.log('Connected to SQL Server'))
    .catch(err => console.error('Database connection failed:', err));

app.get('/', (req, res) => {
    res.render('index'); // Renders the index.ejs file
});

// Routes
app.use('/customers', customerRoutes);
app.use('/bookings', bookingsRouter);

app.use('/travel-packages', travelPackagesRouter);

app.use('/destinations', destinationsRouter);

app.use('/flights', flightsRouter);
app.use('/hotels', hotelsRouter);
app.use('/hotelrooms', hotelRoomsRouter);

app.use('/tours', toursRouter);

app.use('/transport', transportRouter);
app.use('/payments', paymentsRouter);
app.use('/staff', staffRouter);
app.use('/vendors', vendorsRouter);
app.use('/reviews', reviewsRouter);
app.use('/coupons', couponsRouter);

app.use('/complex-queries', complexQueriesRouter);


// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
