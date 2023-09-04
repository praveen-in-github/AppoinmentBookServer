require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const AppointmentBookings = require("./models/appointment.model");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const userRouter = require("./userRouter");
const bookingRouter = require("./bookingRouter");
const redis = require("redis");
const RedisStore = require("connect-redis").default;
// create redis client

const app = express();

app.use(
  cors({
    origin:
      "https://64f57502dbe81d0d5df45b2e--extraordinary-starlight-2c5bda.netlify.app",
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"],
    credentials: true,
    exposedHeaders: ["Content-Length", "X-Foo", "X-Bar", "set-cookie"],
  })
);

const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});

redisClient.connect().catch(console.error);
let redisStore = new RedisStore({
  client: redisClient,
});

redisClient.on("error", (err) => {
  console.log(err);
});

app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: true,
    resave: true,
    store: redisStore,
    cookie: {
      secret: process.env.COOKIE_SECRET,
      secure: process.env.NODE_ENV === "production",
      httpOnly: process.env.NODE_ENV === "production",
      sameSite: "none",
    },
  })
);

let uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true });

const connection = mongoose.connection;

connection.once("open", () => {
  console.log("DataBase Connection Success");
});

// Routing

app.use("/user", userRouter);
app.use("/bookings", bookingRouter);

let port = process.env.PORT || 7000;

app.listen(port, () => {
  console.log("Sever running at Port " + port);
});
