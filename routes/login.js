const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/:id", (req, res) => {
    req.session.users_id = req.params.id;
    console.log(req.session.users_id);
    db.query(`SELECT * FROM users WHERE id = ${req.session.users_id};`)
      .then((data) => {
        const users = data.rows;
        res.redirect("/");
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });
  return router;
};
