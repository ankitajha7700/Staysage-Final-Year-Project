const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const path = require("path");
const expressSession = require("express-session");
const flash = require("connect-flash");
const MongoStore = require("connect-mongo");
const db = require("./config/dbConnection");
const ownersRouter = require("./routes/ownersRouter");
const usersRouter = require("./routes/usersRouter");
const hostelsRouter = require("./routes/hostelsRouter");
const indexRouter = require("./routes/index");
require("dotenv").config();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  expressSession({
    secret: process.env.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: "sessions",
      ttl: 24 * 60 * 60, // 24 hours, you can adjust this as needed
    }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // This is 24 hours in milliseconds
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      httpOnly: true, // Protects against XSS attacks
      secure: process.env.NODE_ENV === "production", // Set to true if you're using HTTPS
      sameSite: 'strict' // Protect against CSRF attacks
    },
  })
);

app.use(flash());
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.use("/", indexRouter);
app.use("/owners", ownersRouter);
app.use("/users", usersRouter);
app.use("/hostels", hostelsRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
