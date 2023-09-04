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

require("dotenv").config();

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
    exposedHeaders: "set-cookie",
  })
);

const redisClient = redis.createClient({
  url: "redis://red-cjqd93u1208c73avibig:6379",
});

redisClient.connect().catch(console.error);
let redisStore = new RedisStore({
  client: redisClient,
});

app.use(express.json());
app.use(cookieParser());
app.use(
  session({
    secret: "935233349324x92",
    saveUninitialized: true,
    resave: true,
    store: redisStore,
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
