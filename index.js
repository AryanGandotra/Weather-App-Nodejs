const http = require("http");
const fs = require("fs");

const homeFile = fs.readFileSync("home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
  let temperature = tempVal.replace(
    "{%tempval%}",
    (orgVal.main.temp - 273.15).toFixed(2)
  );
  temperature = temperature.replace(
    "{%tempmin%}",
    (orgVal.main.temp_min - 273.15).toFixed(2)
  );
  temperature = temperature.replace(
    "{%tempmax%}",
    (orgVal.main.temp_max - 273.15).toFixed(2)
  );
  temperature = temperature.replace("{%location%}", orgVal.name);
  temperature = temperature.replace("{%country%}", orgVal.sys.country);
  temperature = temperature.replace("{%tempstatus%}", orgVal.weather[0].main);

  return temperature;
};

const server = http.createServer((req, res) => {
  if (req.url === "/") {
    var requests = require("requests");
    requests(
      "https://api.openweathermap.org/data/2.5/weather?q=Gurgaon&appid=cf27ad86cbb617a1d7b59defb7d11c03"
    )
      .on("data", function (chunk) {
        chunk = JSON.parse(chunk);
        const arrData = [chunk];
        // console.log(arrdata[0].main.temp);
        const realTimeData = arrData
          .map((val) => replaceVal(homeFile, val))
          .join("");

        res.write(realTimeData);
        // console.log(realTimeData);
      })
      .on("end", function (err) {
        if (err) return console.log("connection closed due to errors", err);
        // console.log("end");
        res.end();
      });
  } else {
    res.end("File not found");
  }
});

server.listen(3000, () => {
  console.log("Server is listening on Port 3000");
});
