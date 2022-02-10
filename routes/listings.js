const express = require("express");
const router = express.Router();
const {beveragesSelected} = require('../public/scripts/helpers');

module.exports = (db) => {
  ////////////////////////////////////////////////////////////
  ///////////////ROUTER FOR MYLISTINGS PAGE///////////////////
  ////////////////////////////////////////////////////////////
  router.get("/myListings", (req, res) => {
    const cookieID = req.session["users_id"];
    console.log(cookieID);
    db.query(
      `SELECT beverages.id, beverages.name, beverages.description, beverages.price, beverages.thumbnail_url, beverages.posted_at, beverages.is_available, beverages.sold_at FROM beverages WHERE seller_id = ${cookieID};`
    )
      .then((data) => {
        const beverages = data.rows;
        console.log(beverages);
        // console.log(beverages[0]["posted_at"])
        // console.log(new Date(beverages[0]["posted_at"]).toISOString().split("T")[0])
        const templateVars = { beverages };
        res.render("myListings", templateVars);
      })
      .catch((err) => {
        console.log("DUHHHHH");
        res.status(500)
          .json({ error: err.message });
      });
  });

  router.post("/myListings", (req, res) => {
    const cookieID = req.session["users_id"];
    console.log(cookieID);
    let queryString = `DELETE FROM beverages WHERE beverages.id = $1;`;

    const queryParams = [req.body["beverage_id"]];
    console.log("queryString", queryString, queryParams);

    db.query(queryString, queryParams)
      .then(() => {
        res.redirect("myListings");
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  ////////////////////////////////////////////////////////////
  ///////////////ROUTER FOR FAVOURITES PAGE///////////////////
  ////////////////////////////////////////////////////////////
  router.get("/favourites", (req, res) => {
    const cookieID = req.session["users_id"];
    console.log(cookieID);
    db.query(
      `SELECT beverages.name, beverages.description, beverages.price, beverages.thumbnail_url, beverages.posted_at FROM favourites JOIN users ON users.id = user_id JOIN beverages ON beverages.id = beverage_id WHERE users.id = ${cookieID};`
    )
      .then((data) => {

        const beverages = data.rows;
        console.log(beverages);
        const templateVars = { beverages };
        res.render("favourites", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/favourites", (req, res) => {
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

  router.post("/deletefavourite", (req, res) => {
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

  ////////////////////////////////////////////////////////////
  ///////////////ROUTER FOR CREATE NEW LISTING///////////////////
  ////////////////////////////////////////////////////////////
  router.get("/newListing", (req, res) => {
    db.query(
      `SELECT name, description, price, thumbnail_url, posted_at FROM beverages
       JOIN categories ON category_id = categories.id;`
    )
      .then((data) => {
        const beverages = data.rows;
        const templateVars = { beverages };
        res.render("newListing", templateVars);
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  router.post("/newListing", (req, res) => {
    const options = {
      beverage: req.body["beverage"],
      price: req.body["price"],
      category: req.body["category"],
      country: req.body["country"],
      thumbnailUrl: req.body["thumbnail_url"],
      description: req.body["description"],
    };
    console.log("options", options);

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

    const queryParams = [
      options.beverage,
      options.description,
      options.price,
      options.thumbnailUrl,
      options.country,
      new Date(),
      null,
      true,
      req.session["users_id"],
      categoryId,
    ];

    console.log("queryString", queryString);
    beveragesSelected[Object.keys(beveragesSelected).length + 1] = false;

    db.query(queryString, queryParams)
      .then((data) => {
        const beverages = data.rows;
        console.log(beverages, beveragesSelected);
        const templateVars = { beverages, beveragesSelected };
        res.render("createdListing", templateVars);
        // res.redirect("myListings");
      })
      .catch((err) => {
        res.status(500).json({ error: err.message });
      });
  });

  ////////////////////////////////////////////////////////////
  ///////////////ROUTER FOR SOLD///////////////////
  ////////////////////////////////////////////////////////////
  router.post("/sold", (req, res) => {
    const cookieID = req.session["users_id"];
    console.log(cookieID);
    let queryString = `UPDATE beverages SET sold_at = NOW(), is_available = FALSE WHERE beverages.id = $1;`;

    const queryParams = [req.body["is_available"]];
    console.log("queryString:", queryString, "queryParams:", queryParams);

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
