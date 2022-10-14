const { ObjectId } = require("mongodb");

const MongoClient = require("mongodb").MongoClient;
const url =
  "mongodb+srv://skdev:skdev123456789@skmongocluster.skdn9.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(url);
const users = client.db("Esport").collection("users");
const event = client.db("Esport").collection("event");

exports.index = async (req, res) => {
  const cursorUser = await users.findOne({ _id: ObjectId(req.user._id) });
  var userEvent = cursorUser.event;
  if (userEvent != "none") {
    const cursorEvent = await event.findOne({ _id: ObjectId(userEvent) });
    userEvent =
      cursorEvent.eventname +
      " [AGE " +
      cursorEvent.eventminage +
      " - " +
      cursorEvent.eventmaxage +
      "] [DATE " +
      cursorEvent.eventstartdate +
      " to " +
      cursorEvent.eventenddate +
      "]";
  }
  var listevent = await this.listEvent();
  res.render("pages/index", {
    user: req.user,
    userEvent: userEvent,
    listEvent: listevent,
  });
};
exports.adminAddNewEvent = (req, res) => {
  event.insertOne({
    eventname: req.body.eventname,
    eventminage: req.body.eventminage,
    eventmaxage: req.body.eventmaxage,
    eventstartdate: req.body.eventstartdate,
    eventenddate: req.body.eventenddate,
  });
  res.redirect("/admin");
};
exports.listEvent = async () => {
  const cursorEvent = event.find({});
  const resultEvent = await cursorEvent.toArray();
  console.log(resultEvent);
  return resultEvent;
};
exports.adminDeleteEvent = (req, res) => {
  event.deleteOne({ _id: ObjectId(req.params.event_id) });
  users.updateMany(
    { event: req.params.event_id },
    {
      $set: {
        event: "none",
      },
    }
  );
  res.redirect("/admin");
};
exports.getEventPage = async (req, res) => {
  const cursorUser = await users.findOne({ _id: ObjectId(req.user._id) });
  var listevent = await this.listEvent();
  const yearNow = new Date().getFullYear();
  const userAge = yearNow - new Date(cursorUser.birthdate).getFullYear();
  for (x in listevent) {
    if (
      userAge >= listevent[x].eventminage &&
      userAge <= listevent[x].eventmaxage
    ) {
    } else {
      listevent.splice(x, 1);
    }
  }

  res.render("pages/getevent", { listEvent: listevent });
};
exports.userGetEvent = async (req, res) => {
  users.updateOne(
    { _id: ObjectId(req.user._id) },
    {
      $set: {
        event: req.body.selectevent,
      },
    }
  );
  res.redirect("/");
};
exports.userRemoveEvent = async (req, res) => {
  users.updateOne(
    { _id: ObjectId(req.user._id) },
    {
      $set: {
        event: "none",
      },
    }
  );
  res.redirect("/");
};
exports.checkevent = async (req, res) => {
  const cursorUser = users.find({ event: req.params.event_id });
  const resultUser = await cursorUser.toArray();
  const yearNow = new Date().getFullYear();
  var userAge;
  for (x in resultUser) {
    userAge = new Date(resultUser[x].birthdate).getFullYear();
    resultUser[x].age = yearNow - userAge;
  }
  const cursorEvent = await event.findOne({
    _id: ObjectId(req.params.event_id),
  });
  res.render("pages/checkevent", {
    user: req.user,
    listUser: resultUser,
    thisEvent: cursorEvent,
  });
};
exports.adminRemoveUserFromEvent = async (req, res) => {
  users.updateOne(
    { _id: ObjectId(req.params.user_id) },
    {
      $set: {
        event: "none",
      },
    }
  );
  const checkeventurl = "/checkevent/" + req.params.event_id;
  res.redirect(checkeventurl);
};
exports.editevent = async (req, res) => {
  const cursorEvent = await event.findOne({
    _id: ObjectId(req.params.event_id),
  });
  res.render("pages/editevent", { thisEvent: cursorEvent });
};
exports.adminEditEvent = async (req, res) => {
  event.updateOne(
    { _id: ObjectId(req.params.event_id) },
    {
      $set: {
        eventname: req.body.eventname,
        eventminage: req.body.eventminage,
        eventmaxage: req.body.eventmaxage,
        eventstartdate: req.body.eventstartdate,
        eventenddate: req.body.eventenddate,
      },
    }
  );
  res.redirect("/admin");
};
exports.editprofile = async (req, res) => {
  const cursorUser = await users.findOne({
    _id: ObjectId(req.params.user_id),
  });
  var userEvent = cursorUser.event;
  if (userEvent != "none") {
    userEvent = await event.findOne({ _id: ObjectId(userEvent) });
  }
  var listevent = await this.listEvent();
  res.render("pages/editprofile", {
    user: req.user,
    thisUser: cursorUser,
    listEvent: listevent,
    nowEvent: userEvent,
  });
};
exports.editProfileProcess = async (req, res) => {
  var updateObject = {
    email: req.body.email,
    name: req.body.name,
    idcard: req.body.idcard,
    birthdate: req.body.birthdate,
    password: req.body.password,
    // role: "member",
    // event: "none",
  };
  if (req.user.role == "admin") {
    updateObject.role = req.body.role;
    updateObject.event = req.body.selectevent;
  }
  users.updateOne(
    { _id: ObjectId(req.params.user_id) },
    {
      $set: updateObject,
    }
  );
  res.redirect("/");
};
exports.listAllUser = async (req, res) => {
  const cursorUser = users.find({});
  const resultUser = await cursorUser.toArray();
  const yearNow = new Date().getFullYear();
  var userAge;
  for (x in resultUser) {
    userAge = new Date(resultUser[x].birthdate).getFullYear();
    resultUser[x].age = yearNow - userAge;
  }
  res.render("pages/listuser", {
    user: req.user,
    listUser: resultUser,
  });
};
exports.adminDeleteUserFromDB = async (req, res) => {
  users.deleteOne({ _id: ObjectId(req.params.user_id) });
  res.redirect("/listAllUser");
};
