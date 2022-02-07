const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.post("/", (req, res) => {
    const cookieID = req.session["users_id"];
    console.log(cookieID);
    let queryString = `UPDATE beverages SET sold_at = NOW(), is_available = FALSE WHERE beverages.id = $1;`;

    const queryParams = [req.body["is_available"]];
    console.log('queryString:', queryString, 'queryParams:', queryParams);

    db.query(queryString, queryParams).then(() => {
      res.redirect("myListings");
    })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  return router;
};
