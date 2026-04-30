const express = require('express');
const {
  createDriver,
  getAllDrivers,
  getDriverById,
  updateDriver
} = require('../controllers/driverController');

const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/drivers:
 *   post:
 *     summary: Create a new driver
 *     description: Creates a driver record that can later be assigned to a registered tuk-tuk.
 *     tags: [Drivers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - fullName
 *               - nic
 *               - phone
 *               - licenseNo
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Nimal Perera
 *               nic:
 *                 type: string
 *                 example: 901234567V
 *               phone:
 *                 type: string
 *                 example: 0771234567
 *               licenseNo:
 *                 type: string
 *                 example: B1234567
 *     responses:
 *       201:
 *         description: Driver created successfully
 *       400:
 *         description: Missing required fields
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Duplicate NIC or license number
 *       500:
 *         description: Server error
 */
router.post('/drivers', protect, createDriver);

/**
 * @swagger
 * /api/drivers:
 *   get:
 *     summary: Get all drivers
 *     description: Retrieves all registered drivers with their assigned tuk-tuks.
 *     tags: [Drivers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Drivers retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/drivers', protect, getAllDrivers);

/**
 * @swagger
 * /api/drivers/{id}:
 *   get:
 *     summary: Get driver by ID
 *     description: Retrieves a single driver using the driver ID.
 *     tags: [Drivers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Driver ID
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Driver retrieved successfully
 *       400:
 *         description: Invalid driver ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Driver not found
 *       500:
 *         description: Server error
 */
router.get('/drivers/:id', protect, getDriverById);

/**
 * @swagger
 * /api/drivers/{id}:
 *   patch:
 *     summary: Update driver
 *     description: Updates driver details. Only provide the fields that need to be changed.
 *     tags: [Drivers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Driver ID
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fullName:
 *                 type: string
 *                 example: Nimal Perera
 *               nic:
 *                 type: string
 *                 example: 901234567V
 *               phone:
 *                 type: string
 *                 example: 0719876543
 *               licenseNo:
 *                 type: string
 *                 example: B1234567
 *     responses:
 *       200:
 *         description: Driver updated successfully
 *       400:
 *         description: Invalid driver ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Driver not found
 *       409:
 *         description: Duplicate NIC or license number
 *       500:
 *         description: Server error
 */
router.patch('/drivers/:id', protect, updateDriver);

module.exports = router;