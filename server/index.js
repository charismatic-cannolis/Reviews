// https://node-postgres.com/features/connecting
//explain analyze query (/timing)
//create index for foreign key

const express = require('express');
const compression = require('compression');
const poolAccess = require('../config.js');
const { Pool, Client } = require('pg');
const path = require('path');

const pool = new Pool(poolAccess);
const app = express();
const port = 3000;

app.listen(port, (err) => {
  if (err) console.error(err);
  console.log(`connected to ${port}`);
});

app.use(compression());
app.use(express.json());

app.get('/test/:id', (req, res) => {
    res.send(req.params.id);
    // pool.query('SELECT * FROM reviews LIMIT 5', (err, queryRes) => {
    //   if (err) {
    //     res.send(err);
    //   } else {
    //     res.send(queryRes.rows);
    //   }
    // //   pool.end();
    // });
})

//UNION ALL SELECT url FROM photos WHERE `
// app.get('/reviews/:id', (req, res) => {
// //   res.send(req.params.id);
    // pool.query(`SELECT * FROM reviews WHERE product_id = '${req.params.id}'`, (err, queryRes) => {
    //   if (err) {
    //       res.send(err);
    //   } else {
    //       res.send(queryRes.rows);
    //   }
    // });
// })

app.get('/reviews', (req, res) => {
  const {product_id, page = 1, count = 5, sort = 'date'} = req.query;
  // sort by newest = date, helpful = helpfulness, or relevant = date/helpful
  // implement relevant
  const instructions = `
    SELECT
      reviews.id,
      product_id,
      rating,
      date,
      summary,
      body,
      recommend,
      reported,
      reviewer_name,
      reviewer_email,
      response,
      helpfulness,
      json_agg(json_build_object ('id', reviews_photos.id, 'url', reviews_photos.url)) AS photos
    FROM
      reviews
    LEFT JOIN reviews_photos
      ON reviews_photos.review_id = reviews.id
    WHERE
      product_id = '${product_id}'
    GROUP BY reviews.id
    ORDER BY 
      ${sort}
    LIMIT ${page * count}
  `;

  // const instructions = `
  //   SELECT * FROM reviews WHERE product_id = '${req.params.id}'
  //   UNION ALL
  //   SELECT url FROM reviews_photos WHERE reviews_photos.review_id = reviews.id
  // `;

  pool.query(instructions, (err, queryRes) => {
    if (err) {
      console.log(err)
        res.send(err);
    } else {
        res.send(queryRes.rows);
    }
  });
});

app.get('/reviews/meta', (req, res) => {
  const {product_id} = req.query;
  const instructions1 = `
    SELECT
      reviews.product_id,
      json_build_object (
        '1', COUNT (reviews.rating) FILTER (WHERE reviews.rating = 1),
        '2', COUNT (reviews.rating) FILTER (WHERE reviews.rating = 2),
        '3', COUNT (reviews.rating) FILTER (WHERE reviews.rating = 3),
        '4', COUNT (reviews.rating) FILTER (WHERE reviews.rating = 4),
        '5', COUNT (reviews.rating) FILTER (WHERE reviews.rating = 5)
      ) AS ratings,
      json_build_object (
        true, COUNT (reviews.recommend) FILTER (where reviews.recommend = true),
        false, COUNT (reviews.recommend) FILTER (where reviews.recommend = false)
      ) AS recommended
    FROM
      reviews
    LEFT JOIN characteristic_reviews
      ON characteristic_reviews.review_id = reviews.id
    WHERE
      reviews.product_id = '${product_id}'
    GROUP BY reviews.product_id
  `;

  const instructions2 = `
    SELECT
      characteristics.char_name,
      json_build_object (
        'id', AVG(characteristics.id),
        'value', AVG(rating)
      ) AS statistics
        
    FROM
      characteristics
    LEFT JOIN characteristic_reviews
      ON characteristic_reviews.characteristic_id = characteristics.id
    WHERE
      product_id = '${product_id}'
    GROUP BY characteristics.char_name
  `

  pool.query(instructions1)
    .then((queryRes) => {
      pool.query(instructions2)
      .then((queryRes2) => {
        let characteristicObject = {};
        queryRes2.rows.forEach((obj) => {
          characteristicObject[obj.char_name] = obj.statistics
        })
        queryRes.rows[0].characteristics = characteristicObject;
        res.send(queryRes.rows[0]);
      })
      .catch((err) => {
        console.error(err);
        res.send(err)
      })
    })
    .catch((err) => {
      console.error(err);
      res.send(err)
    })
});



  // pool.query(instructions1, (err, queryRes) => {
  //   if (err) {
  //     console.log(err);
  //     res.send(err);
  //   } else {
  //     pool.query(instructions2, (err, queryRes2) => {
  //       if (err) {
  //         console.log(err);
  //         res.send(err);
  //       } else {
  //         let characteristicObject = {};
  //         queryRes2.rows.forEach((obj) => {
  //           characteristicObject[obj.char_name] = obj.statistics
  //         })
  //         queryRes.rows[0].characteristics = characteristicObject;
  //         res.send(queryRes.rows[0]);
  //       }
  //     });
  //   }
  // });

//   const instructions1 = `
//   SELECT
//     reviews.product_id,
//     json_build_object (
//       '1', COUNT (reviews.rating) FILTER (WHERE reviews.rating = 1),
//       '2', COUNT (reviews.rating) FILTER (WHERE reviews.rating = 2),
//       '3', COUNT (reviews.rating) FILTER (WHERE reviews.rating = 3),
//       '4', COUNT (reviews.rating) FILTER (WHERE reviews.rating = 4),
//       '5', COUNT (reviews.rating) FILTER (WHERE reviews.rating = 5)
//     ) AS ratings,
//     json_build_object (
//       true, COUNT (reviews.recommend) FILTER (where reviews.recommend = true),
//       false, COUNT (reviews.recommend) FILTER (where reviews.recommend = false)
//     ) AS recommended,
//     json_object_agg(
//       char_name, 'obj'
//     ) AS characteristics
//   FROM
//     reviews
//   LEFT JOIN characteristic_reviews
//     ON characteristic_reviews.review_id = reviews.id
//   LEFT JOIN characteristics
//     ON characteristics.id = characteristic_reviews.characteristic_id
//   WHERE
//     reviews.product_id = '${product_id}'
//   GROUP BY reviews.product_id
// `;

  // pool.query(instructions2, (err, queryRes) => {
  //   if (err) {
  //     console.log(err);
  //       res.send(err);
  //   } else {
  //       res.send(queryRes.rows);
  //   }
  // });
//   const instructions = `
//     SELECT
//       json_object_agg(
//         char_name, 'obj'
//       ) AS characteristics
//     FROM
//       characteristics
//     WHERE
//       characteristics.product_id = '${product_id}'
//   `;

//   const characteristicName = `
//   SELECT
//     characteristics.char_name
//   FROM
//     characteristics
//   WHERE
//     product_id = '${product_id}'
// `



///// ///// /////
// const client = new Client({
//   user: 'dbuser',
//   host: 'database.server.com',
//   database: 'mydb',
//   password: 'secretpassword',
//   port: 3211,
// });

// client.connect()
// client.query('SELECT NOW()', (err, res) => {
//   console.log(err, res)
//   client.end()
// });