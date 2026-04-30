const prisma = require('../config/prisma');

const createLocationPing = async (req, res) => {
  try {
    const { deviceCode, apiKey, latitude, longitude, speed, recordedAt } = req.body;

    if (!deviceCode || !apiKey || latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: 'deviceCode, apiKey, latitude, and longitude are required'
      });
    }

    const device = await prisma.device.findUnique({
      where: { deviceCode },
      include: {
        tukTuks: true
      }
    });

    if (!device || device.apiKey !== apiKey) {
      return res.status(401).json({
        success: false,
        message: 'Invalid device credentials'
      });
    }

    if (!device.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Device is inactive'
      });
    }

    const tukTuk = device.tukTuks[0];

    if (!tukTuk) {
      return res.status(404).json({
        success: false,
        message: 'No tuk-tuk assigned to this device'
      });
    }

    const locationLog = await prisma.locationLog.create({
      data: {
        tukTukId: tukTuk.id,
        latitude,
        longitude,
        speed: speed !== undefined ? speed : null,
        recordedAt: recordedAt ? new Date(recordedAt) : new Date()
      },
      include: {
        tukTuk: {
          select: {
            id: true,
            registrationNo: true,
            status: true
          }
        }
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Location ping recorded successfully',
      data: locationLog
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to record location ping',
      error: error.message
    });
  }
};

const getLatestLocation = async (req, res) => {
  try {
    const tukTukId = Number(req.params.tukTukId);

    if (Number.isNaN(tukTukId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid tuk-tuk ID'
      });
    }

    const tukTuk = await prisma.tukTuk.findUnique({
      where: { id: tukTukId }
    });

    if (!tukTuk) {
      return res.status(404).json({
        success: false,
        message: 'Tuk-tuk not found'
      });
    }

    const latestLocation = await prisma.locationLog.findFirst({
      where: { tukTukId },
      orderBy: {
        recordedAt: 'desc'
      }
    });

    if (!latestLocation) {
      return res.status(404).json({
        success: false,
        message: 'No location records found for this tuk-tuk'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Latest location retrieved successfully',
      data: latestLocation
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve latest location',
      error: error.message
    });
  }
};

const getLocationHistory = async (req, res) => {
  try {
    const tukTukId = Number(req.params.tukTukId);
    const { from, to } = req.query;

    if (Number.isNaN(tukTukId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid tuk-tuk ID'
      });
    }

    const where = { tukTukId };

    if (from || to) {
      where.recordedAt = {};

      if (from) {
        where.recordedAt.gte = new Date(from);
      }

      if (to) {
        where.recordedAt.lte = new Date(to);
      }
    }

    const history = await prisma.locationLog.findMany({
      where,
      orderBy: {
        recordedAt: 'asc'
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Location history retrieved successfully',
      count: history.length,
      data: history
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve location history',
      error: error.message
    });
  }
};

const getLiveLocations = async (req, res) => {
  try {
    const { provinceId, districtId, stationId } = req.query;

    const tukTukWhere = {};

    if (provinceId) tukTukWhere.provinceId = Number(provinceId);
    if (districtId) tukTukWhere.districtId = Number(districtId);
    if (stationId) tukTukWhere.stationId = Number(stationId);

    const tukTuks = await prisma.tukTuk.findMany({
      where: tukTukWhere,
      include: {
        province: true,
        district: true,
        station: true,
        locationLogs: {
          orderBy: {
            recordedAt: 'desc'
          },
          take: 1
        }
      }
    });

    const liveLocations = tukTuks.map((tukTuk) => ({
      id: tukTuk.id,
      registrationNo: tukTuk.registrationNo,
      status: tukTuk.status,
      province: tukTuk.province,
      district: tukTuk.district,
      station: tukTuk.station,
      latestLocation: tukTuk.locationLogs[0] || null
    }));

    return res.status(200).json({
      success: true,
      message: 'Live locations retrieved successfully',
      count: liveLocations.length,
      data: liveLocations
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve live locations',
      error: error.message
    });
  }
};

module.exports = {
  createLocationPing,
  getLatestLocation,
  getLocationHistory,
  getLiveLocations
};