import mongoose from 'mongoose';
const {Schema} = mongoose;
let ratingsAndReviewsSchema = new Schema({
//   [review_id {type: Number}]: {
//     rating: {type: Number, unique: true},
//     summary: String,
//     recommend: Boolean,
//     response: {type: [String, null]},
//     body: String,
//     date: {type: Date, default: Date.now},
//     reviewer_name: String,
//     helpfulness: Number,
//     photos: [{
//       id: Number,
//       url: String
//     }],
//     characteristics: [{
//       size: {type: Number, required: false},
//       width: {type: Number, required: false},
//       comfort: {type: Number, required: false},
//       quality: {type: Number, required: false},
//       length: {type: Number, required: false},
//       fit: {type: Number, required: false},
//     }]
//   }

  review_id: {type: Number, unique: true},
  rating: {type: Number, unique: true},
  summary: String,
  recommend: Boolean,
  response: {type: [String, null]},
  body: String,
  date: {type: Date, default: Date.now},
  reviewer_name: String,
  helpfulness: Number,
  photos: [{
    id: Number,
    url: String
  }],
  characteristics: [{
    size: {type: Number, required: false},
    width: {type: Number, required: false},
    comfort: {type: Number, required: false},
    quality: {type: Number, required: false},
    length: {type: Number, required: false},
    fit: {type: Number, required: false},
  }]
})