const express = require("express");
const router = express.Router();

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = (db) => {
  // router.get("/", (req, res) => {
  //   const cookieID = req.session["users_id"];
  //   console.log(cookieID);
  //   db.query(
  //     `SELECT users.id, users.name, users.email FROM users;`
  //   )
  //     .then((data) => {
  //       const users = data.rows;
  //       console.log(users);
  //       const templateVars = { users };
  //       res.render("messages", templateVars);
  //     })
  //     .catch((err) => {
  //       res.status(500).json({ error: err.message });
  //     });
  // });

  router.post("/", (req, res) => {
    const cookieID = req.session["users_id"];
    console.log(cookieID);
    let queryString = `SELECT name, email FROM users WHERE id = $1;`;

    const queryParams = [req.body["seller_id"]];
    console.log("queryString:", queryString, "queryParams:", queryParams);

    db.query(queryString, queryParams)
      .then((data) => {
        const users = data.rows;
        console.log(users);
        const templateVars = { users };
        res.render("messages", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};
