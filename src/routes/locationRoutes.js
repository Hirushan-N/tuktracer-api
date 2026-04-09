const express = require('express');
const {
  getAllProvinces,
  getAllDistricts,
  getAllStations,
  getDistrictsByProvince,
  getStationsByDistrict
} = require('../controllers/locationController');

const router = express.Router();

/**
 * @swagger
 * /api/provinces:
 *   get:
 *     summary: Get all provinces
 *     tags: [Locations]
 *     responses:
 *       200:
 *         description: Provinces retrieved successfully
 *       500:
 *         description: Failed to retrieve provinces
 */
router.get('/provinces', getAllProvinces);

/**
 * @swagger
 * /api/districts:
 *   get:
 *     summary: Get all districts
 *     tags: [Locations]
 *     responses:
 *       200:
 *         description: Districts retrieved successfully
 *       500:
 *         description: Failed to retrieve districts
 */
router.get('/districts', getAllDistricts);

/**
 * @swagger
 * /api/stations:
 *   get:
 *     summary: Get all police stations
 *     tags: [Locations]
 *     responses:
 *       200:
 *         description: Police stations retrieved successfully
 *       500:
 *         description: Failed to retrieve police stations
 */
router.get('/stations', getAllStations);

/**
 * @swagger
 * /api/provinces/{provinceId}/districts:
 *   get:
 *     summary: Get districts by province id
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: provinceId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Districts by province retrieved successfully
 *       400:
 *         description: Invalid province id
 *       500:
 *         description: Failed to retrieve districts by province
 */
router.get('/provinces/:provinceId/districts', getDistrictsByProvince);

/**
 * @swagger
 * /api/districts/{districtId}/stations:
 *   get:
 *     summary: Get police stations by district id
 *     tags: [Locations]
 *     parameters:
 *       - in: path
 *         name: districtId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Police stations by district retrieved successfully
 *       400:
 *         description: Invalid district id
 *       500:
 *         description: Failed to retrieve police stations by district
 */
router.get('/districts/:districtId/stations', getStationsByDistrict);

module.exports = router;