const fetch = require('node-fetch');
const express = require("express");
const app = express();

app.set("view engine", "ejs");

app.get("/", async (req, res) => {

    const response = await fetch('https://www.gov.uk/bank-holidays.json');
    const data = await response.json();
    
    if (!data.hasOwnProperty("england-and-wales") ||
        !data["england-and-wales"].hasOwnProperty("events")) {
            res.status(500);
            res.data("Error");
            return;
        }

        const holidays = data["england-and-wales"]["events"];

    res.render("index", { holidays });
})

app.listen(3000);
console.log("Server online");