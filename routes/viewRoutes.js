const express = require('express');
const { isLoggedIn } = require('../controllers/authController');
const router = express.Router();

const {
  getOverview,
  getTour,
  getLoginForm,
} = require('../controllers/viewsController');

router.use(isLoggedIn);

router.get('/', getOverview);

router.get('/tour/:slug', getTour);

router.get('/login', getLoginForm);

module.exports = router;
