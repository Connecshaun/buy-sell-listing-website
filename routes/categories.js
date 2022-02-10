/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/sourBeers", (req, res) => {
    const cookieID = req.session["users_id"];
    db.query(
      `SELECT name, description, price, thumbnail_url, posted_at FROM beverages JOIN categories ON category_id = categories.id WHERE categories.type = 'Sour Beers';`
    )
      .then((data) => {
        const beverages = data.rows;
        const templateVars = { beverages, cookieID };
        res.render("sourBeers", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.get("/wine", (req, res) => {
    const cookieID = req.session["users_id"];
    db.query(
      `SELECT name, description, price, thumbnail_url, posted_at FROM beverages JOIN categories ON category_id = categories.id WHERE categories.type = 'Wine';`
    )
      .then((data) => {
        const beverages = data.rows;
        const templateVars = { beverages, cookieID };
        res.render("wine", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.get("/spirits", (req, res) => {
    const cookieID = req.session["users_id"];
    db.query(
      `SELECT name, description, price, thumbnail_url, posted_at FROM beverages JOIN categories ON category_id = categories.id WHERE categories.type = 'Spirits';`
    )
      .then((data) => {
        const beverages = data.rows;
        const templateVars = { beverages, cookieID };
        res.render("spirits", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.get("/coolers", (req, res) => {
    const cookieID = req.session["users_id"];
    db.query(
      `SELECT name, description, price, thumbnail_url, posted_at FROM beverages JOIN categories ON category_id = categories.id WHERE categories.type = 'Coolers';`
    )
      .then((data) => {
        const beverages = data.rows;
        const templateVars = { beverages, cookieID };
        res.render("coolers", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};
