require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");


const cookieParser = require("cookie-parser");
const path = require("path");

const expressSession = require("express-session");
const flash = require("connect-flash");

// const indexRouter = require("./routes/index");
// const onbRoutesGet = require("./routes/onbRoutesGet");
// const onbRoutesPost = require("./routes/onbRoutesPost");
// const uploadRoutes = require("./routes/upload"); not required as of now, will be used when we have file upload functionality in application form

const usersRouter = require("./routes/usersRouter");
const applicationRoutes = require("./routes/applicationRoutes");
// const applicationRoutesGet = require("./routes/applicationRoutesGet");


require("./config/mongoose-connection");

app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.EXPRESS_SESSION_SECRET
  })
);

app.use(flash());
app.use(cors())

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.use("/users", usersRouter);
app.use("/application", applicationRoutes);



// app.use("/upload", uploadRoutes); not required as of now, will be used when we have file upload functionality in application form
// app.use("/", indexRouter);
// app.use("/onb", onbRoutesGet);
// app.use("/onbP", onbRoutesPost); not needed as of now, will be used when we have onboarding form to submit




app.listen(3000, ()=>{
  console.log("Server is running on port 3000");
});
