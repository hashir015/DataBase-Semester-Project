const express = require('express');
const sql = require('mssql');
const router = express.Router();

// Define complex queries with names and purposes
const queries = [
    { 
        name: "Customers with Bookings Details", 
        query: `
            SELECT C.Cust_Name, B.BookingDate, B.Booking_Status, B.TotalAmount 
            FROM Customers C 
            JOIN Bookings B ON C.CustomerID = B.CustomerID
        ` 
    },
    { 
        name: "Top Rated Hotels for Packages", 
        query: `
            SELECT H.Hotel_Name, H.Rating, TP.Package_Name 
            FROM Hotels H 
            JOIN TravelPackages TP ON H.PackageID = TP.PackageID 
            WHERE H.Rating = 5
        ` 
    },
    { 
        name: "Average Package Price by Duration", 
        query: `
            SELECT Duration, AVG(Price) AS AvgPrice 
            FROM TravelPackages 
            GROUP BY Duration 
            HAVING AVG(Price) > 30000
        ` 
    },
    { 
        name: "Customers Using Coupons", 
        query: `
            SELECT C.Cust_Name, CO.Code, CO.DiscountPercent 
            FROM Customers C 
            JOIN Coupons CO ON C.CustomerID = CO.CustomerID
        ` 
    },
    { 
        name: "Transport Details for Packages", 
        query: `
            SELECT TP.Package_Name, T.Transport_Type, T.Cost 
            FROM Transport T 
            JOIN TravelPackages TP ON T.PackageID = TP.PackageID
        ` 
    },
    { 
        name: "Total Revenue by Vendor", 
        query: `
            SELECT V.Vendor_Name, SUM(F.Price) AS TotalRevenue 
            FROM Vendors V 
            JOIN Flights F ON V.VendorID = F.VendorID 
            GROUP BY V.Vendor_Name
        ` 
    },
    { 
        name: "Flights and Related Destinations", 
        query: `
            SELECT F.FlightNumber, F.Price, D.City, D.Country 
            FROM Flights F 
            JOIN Destinations D ON F.DestinationID = D.DestinationID
        ` 
    },
    { 
        name: "Pending Payments by Customers", 
        query: `
            SELECT C.Cust_Name, P.Amount, P.PaymentMethod 
            FROM Payments P 
            JOIN Bookings B ON P.BookingID = B.BookingID 
            JOIN Customers C ON B.CustomerID = C.CustomerID 
            WHERE P.Payment_Status = 'Pending'
        ` 
    },
    { 
        name: "Tours with Destination and Packages", 
        query: `
            SELECT T.Tour_Name, D.City, TP.Package_Name 
            FROM Tours T 
            JOIN Destinations D ON T.DestinationID = D.DestinationID 
            JOIN TravelPackages TP ON T.PackageID = TP.PackageID
        ` 
    },
    { 
        name: "Customers Without Bookings", 
        query: `
            SELECT C.Cust_Name, C.Email 
            FROM Customers C 
            WHERE NOT EXISTS (
                SELECT 1 
                FROM Bookings B 
                WHERE B.CustomerID = C.CustomerID
            )
        ` 
    }
];


// Route for fetching data
router.get('/:queryId', async (req, res) => {
    const queryId = parseInt(req.params.queryId, 10) - 1; // Query index
    if (queryId < 0 || queryId >= queries.length) {
        return res.status(400).send('Invalid query ID');
    }

    try {
        const result = await sql.query(queries[queryId].query);
        res.render('complexQueries', {
            queries: queries,
            data: result.recordset,
            queryId: queryId + 1,
            queryName: queries[queryId].name,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error executing query');
    }
});

module.exports = router;
