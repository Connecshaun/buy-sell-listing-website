const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT name, description, price, thumbnail_url, posted_at FROM beverages
              JOIN categories ON category_id = categories.id
              `)
      .then(data => {
        const beverages = data.rows;
        const templateVars = {beverages};
        res.render("newListing", templateVars);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/", (req, res) => {
    const options = {
      beverage: req.body['beverage'],
      price: req.body['price'],
      category: req.body['category'],
      country: req.body['country'],
      thumbnailUrl: req.body['thumbnail_url'],
      description: req.body['description'],
    };
    console.log('options', options);

    let categoryId = "";
    if (options.category === "Sour Beers") {
      categoryId = 1;
    } else if (options.category === "Wine") {
      categoryId = 2;
    } else if (options.category === "Spirits") {
      categoryId = 3;
    } else if (options.category === "Coolers") {
      categoryId = 4;
    }

    let queryString = `
    INSERT INTO beverages (name, description, price, thumbnail_url, country, posted_at, sold_at, is_available, seller_id, category_id)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
    RETURNING *;`;

    const queryParams = [options.beverage, options.description, options.price, options.thumbnailUrl, options.country, new Date(), null, true, req.session["users_id"], categoryId];

    console.log('queryString', queryString);
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
