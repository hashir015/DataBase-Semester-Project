const sql = require('mssql');

const config = {
    user: 'user',
    password: 'admin1234',
    server: 'localhost',
    database:'Travel_Agency_System' ,
    port:1433,
    options: {
        encrypt: false, // Use this if you're on Azure
        trustServerCertificate: true, // For self-signed certificates
    },
};

const db = new sql.ConnectionPool(config)
.connect()
.then(pool=> {
    console.log("Connect hogya");
    return pool;
})
.catch(err => {
    console.error("Warrr gya",err)
    process.exit(1);
}
);

module.exports = db;
