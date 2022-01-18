require("dotenv").config();
const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const chalk = require("chalk");
const bodyParser = require("body-parser");

const expressSession = require("express-session");
const User = require("./models/User");

/**
 * Controllers (route handlers).
 */

// const homeController = require("./controllers/home");
const userController = require("./controllers/user");
const songsController = require("./controllers/songs");

const songApiController = require("./controllers/api/song");


const app = express();
app.set("view engine", "ejs");

/**
 * notice above we are using dotenv. We can now pull the values from our environment
 */

const { PORT, MONGODB_URI } = process.env;

/**
 * connect to database
 */




mongoose.connect(MONGODB_URI, { useNewUrlParser: true });
mongoose.connection.on("error", (err) => {
  console.error(err);
  console.log(
    "MongoDB connection error. Please make sure MongoDB is running.",
    chalk.red("✗")
  );
  process.exit();
});

/***
 * We are applying our middlewear
 */
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(expressSession({ secret: 'foo barr', cookie: { expires: new Date(253402300000000) } }))


app.use("*", async (req, res, next) => {
  global.user = false;
  if (req.session.userID && !global.user) {
    const user = await User.findById(req.session.userID);
    global.user = user;
  }
  next();
})

const authMiddleware = async (req, res, next) => {
  const user = await User.findById(req.session.userID);
  if (!user) {
    return res.redirect('/');
  }
  next()
}

app.get("/", (req, res) => {
  res.render("index", { errors: {} });
})

app.get("/logout", async (req, res) => {
  req.session.destroy();
  global.user = false;
  res.redirect('/');
})




app.get("/create-song", authMiddleware, (req, res) => {
  res.render("create-song", { errors: {} });
});


app.get("/songs", songsController.list);
app.post("/create-song", songsController.create);
app.get("/songs/delete/:id", songsController.delete);
app.get("/songs/update/:id", songsController.edit);
app.post("/songs/update/:id", songsController.update);

app.get("/search-songs",(req,res) => {
  res.render('search-songs', songApiController);
});

app.get("/api/search-songs", songApiController.list);











// app.get("/join", (req, res) => {
//   res.render('create-user', { errors: {} })
// });

// app.post("/join", userController.create);

app.get("/login", (req, res) => {
  res.render('login-user', { errors: {} })
});
app.post("/login", userController.login);


app.listen(PORT, () => {
  console.log(
    `Example app listening at http://localhost:${PORT}`,
    chalk.green("✓")
  );
});
