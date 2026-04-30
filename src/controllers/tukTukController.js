const prisma = require('../config/prisma');

const createTukTuk = async (req, res) => {
  try {
    const {
      registrationNo,
      model,
      color,
      status,
      driverId,
      deviceId,
      provinceId,
      districtId,
      stationId
    } = req.body;

    if (!registrationNo || !provinceId || !districtId || !stationId) {
      return res.status(400).json({
        success: false,
        message:
          'registrationNo, provinceId, districtId, and stationId are required'
      });
    }

    const existingTukTuk = await prisma.tukTuk.findUnique({
      where: { registrationNo }
    });

    if (existingTukTuk) {
      return res.status(409).json({
        success: false,
        message: 'Tuk-tuk with this registration number already exists'
      });
    }

    const province = await prisma.province.findUnique({
      where: { id: Number(provinceId) }
    });

    const district = await prisma.district.findUnique({
      where: { id: Number(districtId) }
    });

    const station = await prisma.policeStation.findUnique({
      where: { id: Number(stationId) }
    });

    if (!province || !district || !station) {
      return res.status(400).json({
        success: false,
        message: 'Invalid province, district, or station'
      });
    }

    if (driverId) {
      const driver = await prisma.driver.findUnique({
        where: { id: Number(driverId) }
      });

      if (!driver) {
        return res.status(400).json({
          success: false,
          message: 'Invalid driverId'
        });
      }
    }

    if (deviceId) {
      const device = await prisma.device.findUnique({
        where: { id: Number(deviceId) }
      });

      if (!device) {
        return res.status(400).json({
          success: false,
          message: 'Invalid deviceId'
        });
      }
    }

    const tukTuk = await prisma.tukTuk.create({
      data: {
        registrationNo,
        model: model || null,
        color: color || null,
        status: status || 'ACTIVE',
        driverId: driverId ? Number(driverId) : null,
        deviceId: deviceId ? Number(deviceId) : null,
        provinceId: Number(provinceId),
        districtId: Number(districtId),
        stationId: Number(stationId)
      },
      include: {
        driver: true,
        device: true,
        province: true,
        district: true,
        station: true
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Tuk-tuk created successfully',
      data: tukTuk
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create tuk-tuk',
      error: error.message
    });
  }
};

const getAllTukTuks = async (req, res) => {
  try {
    const { provinceId, districtId, stationId, status, registrationNo } = req.query;

    const where = {};

    if (provinceId) where.provinceId = Number(provinceId);
    if (districtId) where.districtId = Number(districtId);
    if (stationId) where.stationId = Number(stationId);
    if (status) where.status = status;

    if (registrationNo) {
      where.registrationNo = {
        contains: registrationNo,
        mode: 'insensitive'
      };
    }

    const tukTuks = await prisma.tukTuk.findMany({
      where,
      include: {
        driver: true,
        device: true,
        province: true,
        district: true,
        station: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Tuk-tuks retrieved successfully',
      count: tukTuks.length,
      data: tukTuks
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve tuk-tuks',
      error: error.message
    });
  }
};

const getTukTukById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid tuk-tuk id'
      });
    }

    const tukTuk = await prisma.tukTuk.findUnique({
      where: { id },
      include: {
        driver: true,
        device: true,
        province: true,
        district: true,
        station: true,
        locationLogs: {
          orderBy: {
            recordedAt: 'desc'
          },
          take: 5
        }
      }
    });

    if (!tukTuk) {
      return res.status(404).json({
        success: false,
        message: 'Tuk-tuk not found'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Tuk-tuk retrieved successfully',
      data: tukTuk
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve tuk-tuk',
      error: error.message
    });
  }
};

const updateTukTuk = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid tuk-tuk id'
      });
    }

    const existingTukTuk = await prisma.tukTuk.findUnique({
      where: { id }
    });

    if (!existingTukTuk) {
      return res.status(404).json({
        success: false,
        message: 'Tuk-tuk not found'
      });
    }

    const {
      registrationNo,
      model,
      color,
      status,
      driverId,
      deviceId,
      provinceId,
      districtId,
      stationId
    } = req.body;

    if (registrationNo && registrationNo !== existingTukTuk.registrationNo) {
      const duplicate = await prisma.tukTuk.findUnique({
        where: { registrationNo }
      });

      if (duplicate) {
        return res.status(409).json({
          success: false,
          message: 'Another tuk-tuk with this registration number already exists'
        });
      }
    }

    const updatedTukTuk = await prisma.tukTuk.update({
      where: { id },
      data: {
        registrationNo: registrationNo ?? existingTukTuk.registrationNo,
        model: model !== undefined ? model : existingTukTuk.model,
        color: color !== undefined ? color : existingTukTuk.color,
        status: status ?? existingTukTuk.status,
        driverId: driverId !== undefined ? (driverId ? Number(driverId) : null) : existingTukTuk.driverId,
        deviceId: deviceId !== undefined ? (deviceId ? Number(deviceId) : null) : existingTukTuk.deviceId,
        provinceId: provinceId !== undefined ? Number(provinceId) : existingTukTuk.provinceId,
        districtId: districtId !== undefined ? Number(districtId) : existingTukTuk.districtId,
        stationId: stationId !== undefined ? Number(stationId) : existingTukTuk.stationId
      },
      include: {
        driver: true,
        device: true,
        province: true,
        district: true,
        station: true
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Tuk-tuk updated successfully',
      data: updatedTukTuk
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update tuk-tuk',
      error: error.message
    });
  }
};

const deleteTukTuk = async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid tuk-tuk id'
      });
    }

    const existingTukTuk = await prisma.tukTuk.findUnique({
      where: { id }
    });

    if (!existingTukTuk) {
      return res.status(404).json({
        success: false,
        message: 'Tuk-tuk not found'
      });
    }

    await prisma.tukTuk.delete({
      where: { id }
    });

    return res.status(200).json({
      success: true,
      message: 'Tuk-tuk deleted successfully'
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to delete tuk-tuk',
      error: error.message
    });
  }
};

module.exports = {
  createTukTuk,
  getAllTukTuks,
  getTukTukById,
  updateTukTuk,
  deleteTukTuk
};