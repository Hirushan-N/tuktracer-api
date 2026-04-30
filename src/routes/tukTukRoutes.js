const express = require('express');
const {
  createTukTuk,
  getAllTukTuks,
  getTukTukById,
  updateTukTuk,
  deleteTukTuk
} = require('../controllers/tukTukController');
const { protect } = require('../middlewares/authMiddleware');
const { authorize } = require('../middlewares/roleMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/tuktuks:
 *   post:
 *     summary: Create a new tuk-tuk
 *     tags: [TukTuks]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - registrationNo
 *               - provinceId
 *               - districtId
 *               - stationId
 *             properties:
 *               registrationNo:
 *                 type: string
 *                 example: WP-TA-1234
 *               model:
 *                 type: string
 *                 example: Bajaj RE
 *               color:
 *                 type: string
 *                 example: Green
 *               status:
 *                 type: string
 *                 example: ACTIVE
 *               driverId:
 *                 type: integer
 *                 example: 1
 *               deviceId:
 *                 type: integer
 *                 example: 1
 *               provinceId:
 *                 type: integer
 *                 example: 1
 *               districtId:
 *                 type: integer
 *                 example: 1
 *               stationId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Tuk-tuk created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authorized
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Duplicate registration number
 */
router.post(
  '/tuktuks',
  protect,
  authorize('HQ_ADMIN', 'PROVINCIAL_ADMIN', 'DISTRICT_OFFICER', 'STATION_OFFICER'),
  createTukTuk
);

/**
 * @swagger
 * /api/tuktuks:
 *   get:
 *     summary: Get all tuk-tuks with optional filters
 *     tags: [TukTuks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: provinceId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: districtId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: stationId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: registrationNo
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Tuk-tuks retrieved successfully
 *       401:
 *         description: Not authorized
 */
router.get('/tuktuks', protect, getAllTukTuks);

/**
 * @swagger
 * /api/tuktuks/{id}:
 *   get:
 *     summary: Get a tuk-tuk by id
 *     tags: [TukTuks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tuk-tuk retrieved successfully
 *       404:
 *         description: Tuk-tuk not found
 */
router.get('/tuktuks/:id', protect, getTukTukById);

/**
 * @swagger
 * /api/tuktuks/{id}:
 *   patch:
 *     summary: Update a tuk-tuk
 *     tags: [TukTuks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tuk-tuk updated successfully
 *       404:
 *         description: Tuk-tuk not found
 */
router.patch(
  '/tuktuks/:id',
  protect,
  authorize('HQ_ADMIN', 'PROVINCIAL_ADMIN', 'DISTRICT_OFFICER', 'STATION_OFFICER'),
  updateTukTuk
);

/**
 * @swagger
 * /api/tuktuks/{id}:
 *   delete:
 *     summary: Delete a tuk-tuk
 *     tags: [TukTuks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Tuk-tuk deleted successfully
 *       404:
 *         description: Tuk-tuk not found
 */
router.delete(
  '/tuktuks/:id',
  protect,
  authorize('HQ_ADMIN', 'PROVINCIAL_ADMIN'),
  deleteTukTuk
);

module.exports = router;