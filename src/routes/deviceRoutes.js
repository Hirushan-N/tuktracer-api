const express = require('express');
const {
  createDevice,
  getAllDevices,
  getDeviceById,
  updateDevice
} = require('../controllers/deviceController');

const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * /api/devices:
 *   post:
 *     summary: Create a tracking device
 *     description: Creates a tracking device. The API key is generated automatically if not provided.
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deviceCode
 *             properties:
 *               deviceCode:
 *                 type: string
 *                 example: DEV-0001
 *               apiKey:
 *                 type: string
 *                 example: optional-custom-api-key
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Device created successfully
 *       400:
 *         description: deviceCode is required
 *       401:
 *         description: Unauthorized
 *       409:
 *         description: Duplicate device code or API key
 *       500:
 *         description: Server error
 */
router.post('/devices', protect, createDevice);

/**
 * @swagger
 * /api/devices:
 *   get:
 *     summary: Get all devices
 *     description: Retrieves all registered tracking devices with assigned tuk-tuks.
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         required: false
 *         description: Search by device code
 *         schema:
 *           type: string
 *         example: DEV
 *       - in: query
 *         name: isActive
 *         required: false
 *         description: Filter active or inactive devices
 *         schema:
 *           type: boolean
 *         example: true
 *     responses:
 *       200:
 *         description: Devices retrieved successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.get('/devices', protect, getAllDevices);

/**
 * @swagger
 * /api/devices/{id}:
 *   get:
 *     summary: Get device by ID
 *     description: Retrieves a single tracking device by ID.
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Device ID
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Device retrieved successfully
 *       400:
 *         description: Invalid device ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Device not found
 *       500:
 *         description: Server error
 */
router.get('/devices/:id', protect, getDeviceById);

/**
 * @swagger
 * /api/devices/{id}:
 *   patch:
 *     summary: Update device
 *     description: Updates tracking device details. Only provide fields that need to be changed.
 *     tags: [Devices]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Device ID
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
 *               deviceCode:
 *                 type: string
 *                 example: DEV-0001
 *               apiKey:
 *                 type: string
 *                 example: new-api-key-value
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Device updated successfully
 *       400:
 *         description: Invalid device ID
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Device not found
 *       409:
 *         description: Duplicate device code or API key
 *       500:
 *         description: Server error
 */
router.patch('/devices/:id', protect, updateDevice);

module.exports = router;