const express = require("express");
const router = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    const cookieID = req.session["users_id"];
    console.log(cookieID);
    db.query(
      `SELECT beverages.id, beverages.name, beverages.description, beverages.price, beverages.thumbnail_url, beverages.posted_at, beverages.is_available, beverages.sold_at FROM beverages WHERE seller_id = ${cookieID};`
    )
      .then((data) => {
        const beverages = data.rows;
        console.log(beverages);
        const templateVars = { beverages };
        res.render("myListings", templateVars);
      })
      .catch((err) => {
        console.log("DUHHHHH");
        res.status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
