var express = require("express");
var app = express();
var bodyParser = require("body-parser");

let data = [
  { id: 1, name: "call Mom" },
  { id: 2, name: "to buy milk" },
];

function findItem(id) {
  let filtered = data.filter((item) => item.id == id);

  if (filtered.length > 0) {
    return filtered[0];
  }
  return null;
}
function deleteItem(id) {
  let existedItem = findItem(id);
  let pos = data.indexOf(existedItem);
  if (pos >= 0) {
    data.splice(pos, 1);
  }
}
function updataItem(id, name) {
  let existedItem = findItem(id);
  existedItem.name = name;
}
function addItem(name) {
  let newId = data.length + 1;

  while (!!findItem(newId)) {
    newId++;
  }
  let note = { id: newId, name: name };
  data.push(note);

  return note;
}

app.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");

  // Request methods you wish to allow
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );

  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader("Access-Control-Allow-Credentials", true);

  // Pass to next layer of middleware
  next();
});
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true,
  })
);

app.get("/", function (req, res) {
  res.send("Notes");
});

app.get("/notes", function (req, res) {
  res.send(data);
});

app.get("/notes/:id", function (req, res) {
  let id = req.params.id;
  let onbjectItem = findItem(id);
  if (!onbjectItem) {
    res.status(400).send("Объект не найден");
  } else {
    res.send(onbjectItem);
  }
});

app.post("/notes", function (req, res) {
  let name = req.body.name;

  if (!name) {
    return res.status(400).send("Имя не может быть пустым");
  } else {
    let note = addItem(name);
    res.status(200).send(note);
  }
});

app.delete("/notes/:id", function (req, res) {
  let id = req.params.id;
  let onbjectItem = findItem(id);
  if (!onbjectItem) {
    res.status(400).send("Объект не найден, и не был удален");
  } else {
    deleteItem(id);
    res.status(200).send();
  }
});

app.put("/notes/:id", function (req, res) {
  console.log(req);
  let id = req.params.id;
  let name = req.body.name;
  let onbjectItem = findItem(id);
  if (!onbjectItem) {
    res.status(400).send("Объект не найден, и не был удален");
  } else {
    updataItem(id, name);
    res.status(200).send();
  }
});

app.listen(3001, function () {
  console.log("Notes app listening on port 3001!");
});
