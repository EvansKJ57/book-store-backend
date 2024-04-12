const express = require('express');

const router = express.Router();

const { getAllCategory } = require('../controller/category-controller');

router.get('/', getAllCategory);

module.exports = router;
