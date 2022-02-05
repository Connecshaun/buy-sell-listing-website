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
    db.query(`SELECT name, description, price, thumbnail_url, posted_at FROM beverages
              JOIN categories ON category_id = categories.id
              `)
      .then(data => {
        const beverages = data.rows;
        const templateVars = {beverages};
        res.render("filter", templateVars);
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/", (req, res) => {
    const options = {
      minimumPrice: req.body['minimum_price'],
      maximumPrice: req.body['maximum_price'],
      country: req.body['country'],
      beverage: req.body['beverage'],
      category: req.body['category'],
      postedAt: req.body['posted_at'],
    };
    console.log('options', options);
    const queryParams = [];

    let queryString = `
    SELECT name, description, price, thumbnail_url, posted_at FROM beverages
    JOIN categories ON category_id = categories.id
    `;

    if (options.minimumPrice) {
      queryParams.push(options.minimumPrice);
      if (queryParams.length > 1) {
        queryString += `AND price >= $${queryParams.length} `;
      } else {
        queryString += `WHERE price >= $${queryParams.length} `;
      }
    }

    if (options.maximumPrice) {
      queryParams.push(options.maximumPrice);
      if (queryParams.length > 1) {
        queryString += `AND price <= $${queryParams.length} `;
      } else {
        queryString += `WHERE price <= $${queryParams.length} `;
      }
    }

    if (options.country) {
      queryParams.push(`%${options.country}%`);
      if (queryParams.length > 1) {
        queryString += `AND country LIKE $${queryParams.length} `;
      } else {
        queryString += `WHERE country LIKE $${queryParams.length} `;
      }
    }

    if (options.beverage) {
      queryParams.push(`%${options.beverage}%`);
      if (queryParams.length > 1) {
        queryString += `AND name LIKE $${queryParams.length} `;
      } else {
        queryString += `WHERE name LIKE $${queryParams.length} `;
      }
    }

    if (options.category) {
      queryParams.push(`%${options.category}%`);
      if (queryParams.length > 1) {
        queryString += `AND type LIKE $${queryParams.length} `;
      } else {
        queryString += `WHERE type LIKE $${queryParams.length} `;
      }
    }

    if (options.postedAt.toUpperCase() === "ASC" || options.postedAt.toUpperCase() === "DESC") {
      queryString += `ORDER BY price ${options.postedAt};`;
    }
    console.log('queryString', queryString);
    db.query(queryString, queryParams).then((data) => {
      const beverages = data.rows;
      const templateVars = {beverages};
      res.render("filter", templateVars);
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

