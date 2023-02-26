const express = require('express');
const router = express.Router();
const {register, login, registerPage, loginPage,productsPage,verify} = require('../controllers/customers')

router.route('/register').post(register)
router.route('/login').post(login)

router.route('/verify').get(verify)
router.route('/register').get(registerPage)
router.route('/login').get(loginPage)
router.route('/products').get(productsPage) 

module.exports = router;