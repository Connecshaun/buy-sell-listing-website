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
    db.query(`SELECT name, description, price, thumbnail_url, posted_at FROM beverages;`)
      .then(data => {
        const beverages = data.rows;
        const templateVars = {beverages}
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


// .then(data => {
//   const users = data.rows;
//   res.json({ users });
// })
// .catch(err => {
//   res
//     .status(500)
//     .json({ error: err.message });
// });
// });
// return router;
// };
