const express = require("express");
const router = express.Router();
const {beveragesSelected} = require('../public/scripts/helpers');

module.exports = (db) => {
  router.post("/", (req, res) => {
    const cookieID = req.session["users_id"];
    console.log(cookieID);
    let queryString = `
    DELETE FROM favourites WHERE user_id = $1 AND beverage_id = $2;`;

    const queryParams = [cookieID, req.body["is_favourite"]];
    beveragesSelected[req.body["is_favourite"]] = false;


    console.log("queryString:", queryString, "queryParams:", queryParams);

    db.query(queryString, queryParams)
      .then(() => {
        res.redirect("favourites");
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};
