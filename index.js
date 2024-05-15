const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const cors = require(cors)
let corsOptions = {
    origin : ['https://nouhi.dev'],
 }
 app.use(cors(corsOptions)) 
const PORT = process.env.PORT || 5001;

const db = new sqlite3.Database("your_database_name.db", err => {
    if (err) {
        console.error(err.message);
    }
    console.log("Connected to the SQLite database.");
});

// Create table if not exists
db.run(`CREATE TABLE IF NOT EXISTS entries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nummer TEXT,
    datum TEXT,
    kilometerstand TEXT,
    preis TEXT,
    liter_getankt TEXT,
    tankstelle TEXT,
    sprit TEXT,
    verbrauch TEXT,
    literpreis TEXT
)`);

app.use(express.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://nouhi.dev');
    // You can also allow requests from any origin using '*':
    // res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    next();
});

app.get("/fetch", (req, res, next) => {
    // Fetch data from SQLite database
    db.all("SELECT * FROM entries", (err, rows) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({
                success: false,
                message: "Failed to fetch entries from the database."
            });
            return;
        }
        res.status(200).json({
            success: true,
            data: rows
        });
    });
});

// Modify this endpoint to save data to SQLite database
app.post("/save", (req, res, next) => {
    const { einträge } = req.body;

    // Insert data into SQLite database
    einträge.forEach(eintrag => {
        const { nummer, datum, kilometerstand, preis, liter_getankt, tankstelle, sprit, verbrauch, literpreis } = eintrag;
        db.run(`INSERT INTO entries (nummer, datum, kilometerstand, preis, liter_getankt, tankstelle, sprit, verbrauch, literpreis) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [nummer, datum, kilometerstand, preis, liter_getankt, tankstelle, sprit, verbrauch, literpreis],
                err => {
                    if (err) {
                        console.error(err.message);
                    }
                    console.log(`A new entry has been inserted with id ${this.lastID}`);
                });
    });

    res.status(200).json({
        success: true,
        message: "Entries have been saved to the database."
    });
});

app.listen(PORT, () => console.log(`Server is running on this port! ${PORT}`));