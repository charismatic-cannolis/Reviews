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

app.get('/test', (req, res) => {
    // res.send('test');
    pool.query('SELECT * FROM reviews LIMIT 5', (err, queryRes) => {
      if (err) {
        res.send(err);
      } else {
        res.send(queryRes.rows);
      }
    //   pool.end();
    });
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

app.get('/reviews/:id', (req, res) => {
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
        url
      FROM
        reviews
      LEFT JOIN reviews_photos
      ON reviews_photos.review_id = reviews.id
      WHERE
        product_id = '${req.params.id}'
    `;

    // const instructions = `
    //   SELECT * FROM reviews WHERE product_id = '${req.params.id}'
    //   UNION ALL
    //   SELECT url FROM reviews_photos WHERE reviews_photos.review_id = reviews.id
    // `;

    pool.query(instructions, (err, queryRes) => {
        if (err) {
            res.send(err);
        } else {
            res.send(queryRes.rows);
        }
      });


    // pool.query(instructions, (err, queryRes) => {
    //   if (err) {
    //       res.send(err);
    //   } else {
    //     //   res.send(queryRes.rows[1].id);
    //     pool.query(`SELECT url FROM reviews_photos WHERE review_id = ${queryRes.rows[1].id}`, (err, query2Res) => {
    //         if (err) {
    //             res.send(err);
    //         } else {
    //             res.send(query2Res);
    //         }
    //     })
    //   }
    // });
})

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