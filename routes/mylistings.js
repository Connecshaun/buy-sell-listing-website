/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    const cookieID = req.session["users_id"];
    console.log(cookieID);
    db.query(
      `SELECT beverages.id, beverages.name, beverages.description, beverages.price, beverages.thumbnail_url, beverages.posted_at FROM beverages WHERE seller_id = ${cookieID};`
    )
      .then((data) => {
        const beverages = data.rows;
        console.log(beverages);
        const templateVars = { beverages };
        res.render("mylistings", templateVars);
      })
      .catch((err) => {
        console.log("DUHHHHH");
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/", (req, res) => {
    const cookieID = req.session["users_id"];
    console.log(cookieID);
    let queryString = `DELETE FROM beverages WHERE beverages.id = $1;`;

    const queryParams = [req.body["beverage_id"]];
    console.log("queryString", queryString, queryParams);

    db.query(queryString, queryParams)
      .then(() => {
        res.redirect("mylistings");
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
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
