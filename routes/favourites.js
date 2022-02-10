const express = require("express");
const router = express.Router();
const {beveragesSelected} = require('../public/scripts/helpers');

module.exports = (db) => {
  router.get("/", (req, res) => {
    const cookieID = req.session["users_id"];
    console.log(cookieID);
    db.query(
      `SELECT beverages.id, beverages.name, description, price, thumbnail_url, posted_at, is_available, sold_at, seller_id
       FROM favourites JOIN users ON users.id = user_id JOIN beverages ON beverages.id = beverage_id WHERE users.id = ${cookieID};`
    )
      .then((data) => {

        const beverages = data.rows;
        console.log("beverages:", beverages, "beveragesSelected:", beveragesSelected, "cookieID:", cookieID);
        const templateVars = { beverages, cookieID, beveragesSelected };
        res.render("favourites", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/", (req, res) => {
    const cookieID = req.session["users_id"];
    console.log(cookieID);
    let queryString = `
    INSERT INTO favourites (user_id, beverage_id)
    VALUES ($1, $2)
    RETURNING *;`;

    const queryParams = [cookieID, req.body["is_favourite"]];
    beveragesSelected[req.body["is_favourite"]] = true;


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
