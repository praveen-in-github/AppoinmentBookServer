const express = require("express");

const protectedRoute = require("./auth-controller");

const router = express.Router();
const AppointmentBookings = require("./models/appointment.model");

router.post("/create", protectedRoute, (req, res) => {
  console.log(req.session.user_id);
  const Subject = req.body.Subject;
  const AppointmentStartDate = new Date(req.body.AppointmentStartDate);
  const AppointmentEndDate = new Date(req.body.AppointmentEndDate);
  const Status = "New";
  const new_appointment = new AppointmentBookings({
    Subject,
    AppointmentStartDate,
    AppointmentEndDate,
    UserId: req.session.user._id,
  });
  new_appointment
    .save()
    .then(() => res.json("Booking Created"))
    .catch((err) => {
      console.log(err);
      res.sendStatus(400).json("Error " + err);
    });
});

router.get("/existingByDate/:date", (req, res) => {
  1;
  let startDate = new Date(req.params.date);

  AppointmentBookings.find({
    AppointmentStartDate: {
      $gt: startDate.setHours(0).setMinutes(0),
      $lt: new Date(req.params.date).setHours(23).setMinutes(59),
    },
  })

    .then((docs) => {
      res.sendStatus(200).send(docs);
      console.log(docs);
    })
    .catch((err) => res.sendStatus(500).send(err));
});
router.get("/filter/:date", async (req, res) => {
  console.log(req.params.date);
  let sd = new Date(req.params.date);
  sd.setHours(0);
  sd.setMinutes(0);
  sd.setDate(1);
  let ed = new Date(req.params.date);
  ed.setHours(23);
  ed.setMinutes(59);
  ed.setDate(31);
  console.log(sd.toString(), " ", ed.toString());
  AppointmentBookings.aggregate([
    { $match: { AppointmentStartDate: { $gt: sd, $lt: ed } } },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$AppointmentStartDate" },
        },
        slotTimes: {
          $push: { start: "$AppointmentStartDate", end: "$AppointmentEndDate" },
        },
      },
    },
  ])
    .then((docs) => {
      res.sendStatus(200).send(docs);
      console.log("docs is " + docs);
    })
    .catch((err) => res.sendStatus(500).send("Some Internal Error Occured"));
});
router.get("/", protectedRoute, (req, res) => {
  AppointmentBookings.find({ UserId: req.session.user._id })
    .then((docs) => {
      console.log(docs);
      res.sendStatus(200).send(docs);
      console.log(docs);
    })
    .catch((err) => res.sendStatus(500).send("Some Internal Error Occured"));
});

router.delete("/:id", protectedRoute, (req, res) => {
  AppointmentBookings.findByIdAndDelete(req.params.id)
    .then(() => {
      console.log(req.params.id);
      res.sendStatus(204).send("Appointment Cancelled");
    })
    .catch((err) => res.sendStatus(500).send(err));
});
module.exports = router;
