const express = require("express");
const User = require("./models/user.model");

const nodemailer = require("nodemailer");

const router = express.Router();

const transporter = nodemailer.createTransport({
  port: process.env.MAIL_SERVER_PORT,
  host: process.env.GOOGLE_MAIL_SERVER,
  auth: {
    user: process.env.MAIL_SERVER_USERNAME,
    pass: process.env.MAIL_SERVER_PASSWORD,
  },
  secure: true,
  tls: {
    rejectUnauthorized: false,
  },
});

router.get("/sendOtp/:email", (req, res) => {
  if (req.session.otp_sent) {
    if (req.session.otp_sent > 5) {
      res.send(
        "OTP Limit Exceeded for email Address.Please try After Some time"
      );
      return;
    }
  } else {
    req.session.otp_sent = 0;
  }

  let otp = parseInt(Math.random() * 10000);
  otp = otp.toString();
  while (otp.length != 4) {
    otp = "0" + otp;
  }

  req.session.generated_otp = otp;
  req.session.email = req.params.email;
  console.log(otp);

  const mailData = {
    from: "praveenmadivada651@gmail.com",
    to: req.params.email,
    Subject: "Register for Booking Site",
    text: `If Registration was requested by you use the otp:${otp} to login to the web app. Else ignore this mail`,
  };

  transporter.sendMail(mailData, function (err, info) {
    if (err) {
      res.send("Mail Error");
      console.log(err);
    } else {
      console.log(res.statusCode);
      console.log(res.body);
      console.log("Mail Sent");
      res.sendStatus(200).send("Check Mail");
    }
  });
});

router.patch("/logout", (req, res) => {
  req.session.destroy();
  console.log("LoggedOut");
  res.sendStatus(200).send("Success");
});
router.post("/verifyOtp", async (req, res) => {
  console.log("Stored OTP is " + req.session.generated_otp);
  console.log("Body otp is" + req.body.otp);
  if (req.session.generated_otp == req.body.otp) {
    try {
      let user;
      user = await User.find({ email: req.session.email });
      if (user.length == 0) {
        user = await User.create({ email: req.session.email });
      }
      console.log(user);
      console.log(req.session.email);
      req.session.user = user;
      console.log(req.session.user);
      console.log(res.statusCode);
      console.log(res.body);
      res.status(200).send("Verified");
    } catch (err) {
      console.log(err);
      console.log(res.statusCode);
      console.log(res.body);
      res.status(500).send("Internal Server Error");
    }
    return;
  } else {
    console.log("OTP MisMatch");
    console.log(res.statusCode);
    console.log(res.body);
    res.status(204).send("Invalid Otp");
    return;
  }
});
module.exports = router;
