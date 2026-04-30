const express = require('express');
const {
  getSystemSummary,
  getProvinceSummary,
  getInactiveVehicles,
  getDistrictSummary
} = require('../controllers/reportController');

const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/reports/summary:
 *   get:
 *     summary: Get overall system summary
 *     description: Returns total counts for tuk-tuks, drivers, devices, location logs, provinces, districts, and police stations.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: System summary retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/reports/summary', protect, getSystemSummary);

/**
 * @swagger
 * /api/reports/province-summary:
 *   get:
 *     summary: Get province-wise tuk-tuk summary
 *     description: Returns province-level counts including district count and tuk-tuk status breakdown.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Province summary retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/reports/province-summary', protect, getProvinceSummary);

/**
 * @swagger
 * /api/reports/district-summary:
 *   get:
 *     summary: Get district-wise tuk-tuk summary
 *     description: Returns district-level counts including police station count and tuk-tuk status breakdown.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: District summary retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/reports/district-summary', protect, getDistrictSummary);

/**
 * @swagger
 * /api/reports/inactive-vehicles:
 *   get:
 *     summary: Get inactive vehicles
 *     description: Returns tuk-tuks that have no location records or have not sent a location ping within the selected number of hours.
 *     tags: [Reports]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: hours
 *         required: false
 *         description: Number of hours after which a tuk-tuk is considered inactive
 *         schema:
 *           type: integer
 *         example: 6
 *     responses:
 *       200:
 *         description: Inactive vehicles retrieved successfully
 *       400:
 *         description: Invalid hours value
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/reports/inactive-vehicles', protect, getInactiveVehicles);

module.exports = router;