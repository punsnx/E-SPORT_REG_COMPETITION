const MongoClient = require("mongodb").MongoClient;
const url =
  "mongodb+srv://skdev:skdev123456789@skmongocluster.skdn9.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(url);
const users = client.db("Esport").collection("users");
const event = client.db("Esport").collection("event");
exports.insertUser = (req, res) => {
  users.insertOne({
    email: req.body.email,
    name: req.body.name,
    idcard: req.body.idcard,
    birthdate: req.body.birthdate,
    password: req.body.password,
    role: "member",
    event: "none",
  });
  res.redirect("/login");
};
