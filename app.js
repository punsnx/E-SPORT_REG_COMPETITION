const express = require("express");
const app = express();
const passport = require("passport");
const session = require("express-session");
const morgan = require("morgan");
const initializePassport = require("./passport-config");
const reg = require("./register");
const cp = require("./compute");

initializePassport(passport);
app.use(morgan("combined"));
app.use(express.urlencoded({ extended: false }));
app.use(
  session({
    secret: "SECRET",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.set("views", "./src/views");
app.set("view engine", "ejs");

app.get("/", checkAuth, (req, res) => {
  cp.index(req, res);
});
app.get("/register", checkNotAuth, (req, res) => {
  res.render("pages/register");
});
app.post("/insertUser", checkNotAuth, (req, res) => {
  reg.insertUser(req, res);
});
app.get("/login", checkNotAuth, (req, res) => {
  res.render("pages/login");
});
app.post(
  "/login",
  checkNotAuth,
  passport.authenticate("local", {
    failureRedirect: "/login",
    successRedirect: "/",
  })
);
app.post("/logout", checkAuth, (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next();
    }
    res.redirect("/login");
  });
});
app.get("/admin", checkAdminAuth, async (req, res) => {
  var listevent = await cp.listEvent();
  res.render("pages/admin", { listEvent: listevent });
});
app.post("/adminAddNewEvent", checkAdminAuth, (req, res) => {
  cp.adminAddNewEvent(req, res);
});
app.post("/adminDeleteEvent/:event_id", checkAdminAuth, (req, res) => {
  cp.adminDeleteEvent(req, res);
});
app.get("/getevent", checkAuth, async (req, res) => {
  cp.getEventPage(req, res);
});
app.post("/userGetEvent", checkAuth, (req, res) => {
  cp.userGetEvent(req, res);
});
app.post("/userRemoveEvent", checkAuth, (req, res) => {
  cp.userRemoveEvent(req, res);
});
app.get("/checkevent/:event_id", checkAuth, async (req, res) => {
  cp.checkevent(req, res);
});
app.post(
  "/adminRemoveUserFromEvent/:event_id/:user_id",
  checkAdminAuth,
  (req, res) => {
    cp.adminRemoveUserFromEvent(req, res);
  }
);
app.get("/editevent/:event_id", checkAdminAuth, async (req, res) => {
  cp.editevent(req, res);
});
app.post("/adminEditEvent/:event_id", checkAdminAuth, async (req, res) => {
  cp.adminEditEvent(req, res);
});
app.get("/editprofile/:user_id", checkAuth, async (req, res) => {
  cp.editprofile(req, res);
});
app.post("/editProfileProcess/:user_id", checkAuth, async (req, res) => {
  cp.editProfileProcess(req, res);
});
app.get("/listAllUser", checkAdminAuth, async (req, res) => {
  cp.listAllUser(req, res);
});
app.post(
  "/adminDeleteUserFromDB/:user_id",
  checkAdminAuth,
  async (req, res) => {
    cp.adminDeleteUserFromDB(req, res);
  }
);
app.listen(80);

function checkAuth(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/login");
}
function checkNotAuth(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect("/");
  }
  return next();
}
function checkAdminAuth(req, res, next) {
  if (req.isAuthenticated() && req.user.role == "admin") {
    return next();
  }
  res.redirect("/");
}
