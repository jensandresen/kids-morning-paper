const http = require("http");
const fs = require("fs");

const server = http.createServer((req, res) => {
  console.log("Incomming request on: " + req.url);
  const content = fs.readFileSync("/data/data.json", { encoding: "utf8" });
  res.writeHead(200, {
    "content-type": "application/json",
  });
  res.write(content);
  res.end();
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log("server started at port " + port);
});
