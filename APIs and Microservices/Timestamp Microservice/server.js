const express = require("express"),
  app = express(),
  cors = require("cors");

app.use(express.static("public"));
app.use(cors({ optionSuccessStatus: 200 }));

app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
});

app.get("/api/timestamp/", (req, res) => {
  let datee = new Date();
  res.json({ unix: datee.getTime(), utc: datee.toUTCString() });
});

app.get("/api/timestamp/:date_string", (req, res) => {
  let date;
  let dataString = req.params.date_string;
  if (!isNaN(dataString)) {
    date = new Date(parseInt(dataString));
  } else {
    date = new Date(dataString);
  }

  if (date.toString() === "Invalid Date") {
    res.json({ error: date.toString() });
  } else {
    res.json({ unix: date.getTime(), utc: date.toUTCString() });
  }
});

const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
