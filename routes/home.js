const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT beverages.id, name, description, price, thumbnail_url, posted_at, is_available, sold_at, seller_id FROM beverages;`)
      .then(data => {
        const beverages = data.rows;
        const templateVars = {beverages};
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



