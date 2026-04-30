const prisma = require('../config/prisma');

const createDriver = async (req, res) => {
  try {
    const { fullName, nic, phone, licenseNo } = req.body;

    if (!fullName || !nic || !phone || !licenseNo) {
      return res.status(400).json({
        success: false,
        message: 'fullName, nic, phone, and licenseNo are required'
      });
    }

    const existingNic = await prisma.driver.findUnique({ where: { nic } });

    if (existingNic) {
      return res.status(409).json({
        success: false,
        message: 'Driver with this NIC already exists'
      });
    }

    const existingLicense = await prisma.driver.findUnique({
      where: { licenseNo }
    });

    if (existingLicense) {
      return res.status(409).json({
        success: false,
        message: 'Driver with this license already exists'
      });
    }

    const driver = await prisma.driver.create({
      data: { fullName, nic, phone, licenseNo }
    });

    return res.status(201).json({
      success: true,
      message: 'Driver created successfully',
      data: driver
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to create driver',
      error: error.message
    });
  }
};

const getAllDrivers = async (req, res) => {
  try {
    const drivers = await prisma.driver.findMany({
      include: {
        tukTuks: {
          select: {
            id: true,
            registrationNo: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json({
      success: true,
      message: 'Drivers retrieved successfully',
      data: drivers
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve drivers',
      error: error.message
    });
  }
};

const getDriverById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const driver = await prisma.driver.findUnique({
      where: { id },
      include: {
        tukTuks: true
      }
    });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: driver
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateDriver = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const driver = await prisma.driver.findUnique({ where: { id } });

    if (!driver) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    const updated = await prisma.driver.update({
      where: { id },
      data: req.body
    });

    return res.status(200).json({
      success: true,
      message: 'Driver updated',
      data: updated
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createDriver,
  getAllDrivers,
  getDriverById,
  updateDriver
};