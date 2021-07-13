// const db = require('../../db');

const poolAccess = require('../../config.js');
const { Pool, Client } = require('pg');
const path = require('path');
const pool = new Pool(poolAccess);

module.exports = {
  reviews: (req, res) => {
    const {product_id, page = 1, count = 5, sort = 'date'} = req.query;
    if (page * count > 1000) res.status(404).end();
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
    pool.query(instructions)
      .then((queryResponse) => {
        res.status(200).send(queryResponse.rows);
      })
      .catch((err) => {
        res.status(404).send(err);
      })
  },
  meta: (req, res) => {
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
      .then((queryResponse) => {
        pool.query(instructions2)
        .then((queryResponse2) => {
          let characteristicObject = {};
          queryResponse2.rows.forEach((obj) => {
            characteristicObject[obj.char_name] = obj.statistics
          })
          queryResponse.rows[0].characteristics = characteristicObject;
          res.status(200).send(queryResponse.rows[0]);
        })
        .catch((err) => {
          console.error(err);
          res.status(404).send(err)
        })
      })
      .catch((err) => {
        console.error(err);
        res.status(404).send(err)
      })
  }
}