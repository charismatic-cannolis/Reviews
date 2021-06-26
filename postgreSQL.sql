-- createdb "ratings_and_reviews"

DROP DATABASE IF EXISTS "ratings_and_reviews";

CREATE DATABASE "ratings_and_reviews";
\c "ratings_and_reviews";
-- SELECT DATABASE "ratings_and_reviews";

-- GRANT ALL PRIVILEGES ON DATABASE "ratings_and_reviews" TO "parker";


DROP TABLE IF EXISTS
  "reviews", "reviews_photos", "characteristics", "characteristic_reviews";

CREATE TABLE "reviews" (
  "id" serial PRIMARY KEY,
  "product_id" text NOT NULL,
  "rating" integer NOT NULL,
  "date" text NOT NULL,
  "summary" text NOT NULL,
  "body" text NOT NULL,
  "recommend" boolean NOT NULL,
  "reported" boolean default false,
  "reviewer_name" text NOT NULL,
  "reviewer_email" text NOT NULL,
  "response" text,
  "helpfulness" integer NOT NULL
);

CREATE TABLE "reviews_photos" (
  "id" serial PRIMARY KEY,
  "review_id" integer NOT NULL,
  "url" text NOT NULL
);

CREATE TABLE "characteristics" (
  "id" serial PRIMARY KEY,
  "product_id" integer NOT NULL,
  "char_name" text NOT NULL
);

CREATE TABLE "characteristic_reviews" (
  "id" serial PRIMARY KEY,
  "characteristic_id" integer NOT NULL,
  "review_id" integer NOT NULL,
  "rating" integer NOT NULL
);


ALTER TABLE "reviews_photos" ADD FOREIGN KEY ("review_id") REFERENCES "reviews" ("id");
ALTER TABLE "characteristic_reviews" ADD FOREIGN KEY ("characteristic_id") REFERENCES "characteristics" ("id");
ALTER TABLE "characteristic_reviews" ADD FOREIGN KEY ("review_id") REFERENCES "reviews" ("id");

COPY "reviews"
FROM '/home/parker/hackreactor/ratingsAndReviews/reviews.csv'
DELIMITER ','
CSV HEADER;

COPY "reviews_photos"
FROM '/home/parker/hackreactor/ratingsAndReviews/reviews_photos.csv'
DELIMITER ','
CSV HEADER;

COPY "characteristics"
FROM '/home/parker/hackreactor/ratingsAndReviews/characteristics.csv'
DELIMITER ','
CSV HEADER;

COPY "characteristic_reviews"
FROM '/home/parker/hackreactor/ratingsAndReviews/characteristic_reviews.csv'
DELIMITER ','
CSV HEADER;