const express = require("express");
const router = express.Router();

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = (db) => {
  router.post("/", (req, res) => {
    const cookieID = req.session["users_id"];
    console.log("cookieID:", cookieID);
    console.log("req.body:", req.body);
    const msg = {
      to: req.body["seller_email"], // Change to your recipient
      from: 'joegrewal20@gmail.com', // <---Will stay the same
      subject: req.body["subject"],
      text: req.body["email_body"],
      html: `<strong>${req.body["email_body"]}</strong><br><br><a href="mailto=${req.body["user_email"]}">Reply To Sender's Email</a>`,
    };
    console.log("msg:", msg);
    sgMail
      .send(msg)
      .then(() => {
        console.log('Email sent');
        res.redirect('/');
      })
      .catch((error) => {
        console.error(error);
      });
  });
  return router;
};
