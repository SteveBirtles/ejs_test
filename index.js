const fetch = require("node-fetch");
const express = require("express");
const moment = require("moment");

const app = express();

//app.use(express.json()) // for parsing application/json
//app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.set("view engine", "ejs");

app.get("/", async (req, res) => {

  console.log(req.method, "request:", req.hostname, req.path);

  const response = await fetch('https://www.gov.uk/bank-holidays.json');
  const data = await response.json();

  if (!data.hasOwnProperty("england-and-wales") ||
    !data["england-and-wales"].hasOwnProperty("events")) {
    res.status(500);
    res.data("Error");
    return;
  }

  const allHolidays = data["england-and-wales"]["events"];

  const holidaysWithDaysToGo = allHolidays.map(holiday => {
    
    const now = moment();    
    const then = moment(holiday.date);
    
    return {
      title: holiday.title,
      date: holiday.date,
      daysToGo: then.diff(now, "days"),
      substitueDay: holiday.notes.includes("Substitute day"),
      buntingRequired: holiday.bunting
    }

  });

  const futureHolidays = holidaysWithDaysToGo.filter(
    holiday => holiday.daysToGo >= 0
  );

  res.render("index", { holidays: futureHolidays });
})

app.listen(3000);
console.log("Server online");