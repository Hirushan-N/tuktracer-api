const express = require('express');
const {
  createLocationPing,
  getLatestLocation,
  getLocationHistory,
  getLiveLocations
} = require('../controllers/trackingController');

const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/tracking/ping:
 *   post:
 *     summary: Submit location ping
 *     description: Receives GPS location data from a registered tracking device and stores it as a movement log.
 *     tags: [Tracking]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deviceCode
 *               - apiKey
 *               - latitude
 *               - longitude
 *             properties:
 *               deviceCode:
 *                 type: string
 *                 example: DEV-0001
 *               apiKey:
 *                 type: string
 *                 example: paste-device-api-key-here
 *               latitude:
 *                 type: number
 *                 example: 6.9271
 *               longitude:
 *                 type: number
 *                 example: 79.8612
 *               speed:
 *                 type: number
 *                 example: 32.5
 *               recordedAt:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-04-30T10:30:00.000Z
 *     responses:
 *       201:
 *         description: Location ping recorded successfully
 *       400:
 *         description: Required fields missing
 *       401:
 *         description: Invalid device credentials
 *       403:
 *         description: Device inactive
 *       404:
 *         description: No tuk-tuk assigned to device
 *       500:
 *         description: Server error
 */
router.post('/tracking/ping', createLocationPing);

/**
 * @swagger
 * /api/tracking/live:
 *   get:
 *     summary: Get live/latest locations
 *     description: Retrieves latest known locations for tuk-tuks, optionally filtered by province, district, or police station.
 *     tags: [Tracking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: provinceId
 *         required: false
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: districtId
 *         required: false
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: stationId
 *         required: false
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Live locations retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/tracking/live', protect, getLiveLocations);

/**
 * @swagger
 * /api/tuktuks/{tukTukId}/location/latest:
 *   get:
 *     summary: Get latest tuk-tuk location
 *     description: Retrieves the latest recorded GPS location of a selected tuk-tuk.
 *     tags: [Tracking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tukTukId
 *         required: true
 *         description: Tuk-tuk ID
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Latest location retrieved successfully
 *       400:
 *         description: Invalid tuk-tuk ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Tuk-tuk or location not found
 *       500:
 *         description: Server error
 */
router.get('/tuktuks/:tukTukId/location/latest', protect, getLatestLocation);

/**
 * @swagger
 * /api/tuktuks/{tukTukId}/location/history:
 *   get:
 *     summary: Get tuk-tuk movement history
 *     description: Retrieves historical movement logs for a tuk-tuk. Supports optional date/time filtering.
 *     tags: [Tracking]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: tukTukId
 *         required: true
 *         description: Tuk-tuk ID
 *         schema:
 *           type: integer
 *         example: 1
 *       - in: query
 *         name: from
 *         required: false
 *         description: Start date/time filter
 *         schema:
 *           type: string
 *           format: date-time
 *         example: 2026-04-23T00:00:00.000Z
 *       - in: query
 *         name: to
 *         required: false
 *         description: End date/time filter
 *         schema:
 *           type: string
 *           format: date-time
 *         example: 2026-04-30T23:59:59.000Z
 *     responses:
 *       200:
 *         description: Location history retrieved successfully
 *       400:
 *         description: Invalid tuk-tuk ID
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/tuktuks/:tukTukId/location/history', protect, getLocationHistory);

module.exports = router;