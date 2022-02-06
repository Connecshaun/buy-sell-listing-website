/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    const cookieID = req.session["users_id"];
    console.log(cookieID);
    db.query(`SELECT beverages.name, beverages.description, beverages.price, beverages.thumbnail_url, beverages.posted_at FROM favourites JOIN users ON users.id = user_id JOIN beverages ON beverages.id = beverage_id WHERE users.id = ${cookieID};`)
      .then(data => {
        const beverages = data.rows;
        console.log(beverages);
        const templateVars = {beverages};
        res.render("favourites", templateVars);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
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
    console.log('queryString:', queryString, 'queryParams:', queryParams);

    db.query(queryString, queryParams).then(() => {
      res.redirect("favourites");
    })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  return router;
};


