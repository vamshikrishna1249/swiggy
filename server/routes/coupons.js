const express = require('express');
const router = express.Router();
const { validateCoupon } = require('../controllers/couponController');

router.get('/:code', validateCoupon);

module.exports = router;
