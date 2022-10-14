const LocalStrategy = require("passport-local").Strategy;
const MongoClient = require("mongodb").MongoClient;
const url =
  "mongodb+srv://skdev:skdev123456789@skmongocluster.skdn9.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(url);
const users = client.db("Esport").collection("users");
const event = client.db("Esport").collection("event");

function initialize(passport) {
  const authenticator = async (email, password, done) => {
    const cursor = users.find({ email: email });
    const result = await cursor.toArray();
    var user = result[0];
    if (user?.email == null) {
      return done(null, false);
    }
    if (password == user.password) {
      return done(null, user);
    }
    return done(null, false);
  };
  passport.use(
    new LocalStrategy(
      {
        usernameField: "email",
        passwordField: "password",
      },
      authenticator
    )
  );
  passport.serializeUser((user, done) => done(null, user));
  passport.deserializeUser((user, done) => {
    done(null, user);
  });
}

module.exports = initialize;
