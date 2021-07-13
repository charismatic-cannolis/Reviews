const poolAccess = require('../config.js');
const { Pool, Client } = require('pg');
const path = require('path');

const pool = new Pool(poolAccess);

module.exports = pool;