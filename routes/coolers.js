const express = require("express");
const router = express.Router();
const {beveragesSelected} = require('../public/scripts/helpers');

module.exports = (db) => {
  router.get("/", (req, res) => {
    const cookieID = req.session["users_id"];
    db.query(
      `SELECT beverages.id, name, description, price, thumbnail_url, posted_at, beverages.is_available, sold_at, seller_id FROM beverages JOIN categories ON category_id = categories.id WHERE categories.type = 'Coolers';`
    )
      .then((data) => {
        const beverages = data.rows;
        console.log("beverages:", beverages, "beveragesSelected:", beveragesSelected);
        const templateVars = { beverages, cookieID, beveragesSelected };
        res.render("coolers", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};
