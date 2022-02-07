const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT beverages.id, name, description, price, thumbnail_url, posted_at, is_available FROM beverages;`)
      .then(data => {
        const beverages = data.rows;
        const templateVars = {beverages};
        res.render("messages", templateVars);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};



