const express = require('express');
const router  = express.Router();
const {beveragesSelected} = require('../public/scripts/helpers');

module.exports = (db) => {
  router.get("/", (req, res) => {
    const cookieID = req.session["users_id"];
    console.log("cookieID:", cookieID);
    db.query(`SELECT beverages.id, name, description, price, thumbnail_url, posted_at, is_available, sold_at, seller_id FROM beverages;`)
      .then(data => {
        const beverages = data.rows;
        console.log("beverages:", beverages, "beveragesSelected:", beveragesSelected);
        const templateVars = {beverages, beveragesSelected};
        res.render("index", templateVars);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};



