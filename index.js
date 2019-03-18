const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const bodyParser = require("body-parser");
const multer = require('multer');
const flash = require('connect-flash');
// const LocalStrategy = require("passport-local").Strategy;
// const User = require("./models/User");

const app = express();

require("dotenv").config();

const { DB_USERNAME, DB_PASSWORD } = process.env;

mongoose
  .connect(
    `mongodb://${DB_USERNAME}:${DB_PASSWORD}@ds163764.mlab.com:63764/jrs`
  )
  .then(() => console.log("Database connected!"))
  .catch(err => console.log(`Database connection error: ${err.message}`));

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(flash());

app.use(
  require("express-session")({
    secret: "This web is only for assignment",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());

require("./services/passport");


const storage = multer.diskStorage({
  filename: function(req,file, cb){
    cb(null, Date.now() + file.originalname);
  }
})

const imageFilter = function(req, file, cb){
  if(!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf)$/i)){
    return cb(new Error("only Images and PDF file are allowed!"), false);
  }
  cb(null, true);
}

const upload = multer({storage, fileFilter: imageFilter})

require("./services/cloudinary");

require("./routes/mainRoutes")(app, upload);
require("./routes/authRoutes")(app, upload);
require("./routes/companyRoutes")(app);
require("./routes/jobsRoutes")(app);
require("./routes/quickhireRoutes")(app);




app.use(express.static(__dirname + '/public'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("Server is running...");
});
