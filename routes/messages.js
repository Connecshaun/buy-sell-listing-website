const express = require("express");
const router = express.Router();

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

module.exports = (db) => {
  router.post("/", (req, res) => {
    const cookieID = req.session["users_id"];
    console.log(cookieID);
    let queryString = `SELECT users.name AS name, email, beverages.name AS beverage FROM beverages JOIN users ON seller_id = users.id WHERE users.id = $1 OR users.id = $2;`;

    const queryParams = [req.body["seller_id"], cookieID];
    console.log("queryString:", queryString, "queryParams:", queryParams);

    db.query(queryString, queryParams)
      .then((data) => {
        const users = data.rows;
        console.log("users:", users);
        const templateVars = { users };
        res.render("messages", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};
