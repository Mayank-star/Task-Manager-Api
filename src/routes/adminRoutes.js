const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const { getAdminData } = require('../controllers/adminController');
const router = express.Router();

router.get('/dashboard',authMiddleware,roleMiddleware('admin'),getAdminData)

module.exports = router;