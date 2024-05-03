const express = require('express');
const router = express.Router();

const { getAllCategory } = require('../controller/categoryController');

router.get('/', getAllCategory);

module.exports = router;
