const dotenv = require("dotenv");
dotenv.config();
const express = require("express");

const app = express();

const PORT = process.env.PORT || 5001;

app.get("/fetch", (req, res, next) => {
    res.status(200).json({
        success: true,
        data: {
            message: "Works!"
        }
    });
});

app.listen(PORT, () => console.log(`Server is running on this port! ${PORT}`));