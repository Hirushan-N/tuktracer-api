const prisma = require('../config/prisma');
const crypto = require('crypto');

const createDevice = async (req, res) => {
  try {
    const { deviceCode } = req.body;

    if (!deviceCode) {
      return res.status(400).json({
        success: false,
        message: 'deviceCode is required'
      });
    }

    const apiKey = crypto.randomBytes(24).toString('hex');

    const device = await prisma.device.create({
      data: {
        deviceCode,
        apiKey
      }
    });

    return res.status(201).json({
      success: true,
      message: 'Device created',
      data: device
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getAllDevices = async (req, res) => {
  try {
    const devices = await prisma.device.findMany({
      include: {
        tukTuks: true
      }
    });

    return res.status(200).json({
      success: true,
      data: devices
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getDeviceById = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const device = await prisma.device.findUnique({
      where: { id },
      include: { tukTuks: true }
    });

    if (!device) {
      return res.status(404).json({
        success: false,
        message: 'Device not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: device
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateDevice = async (req, res) => {
  try {
    const id = Number(req.params.id);

    const updated = await prisma.device.update({
      where: { id },
      data: req.body
    });

    return res.status(200).json({
      success: true,
      message: 'Device updated',
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
  createDevice,
  getAllDevices,
  getDeviceById,
  updateDevice
};