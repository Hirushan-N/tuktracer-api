const {
  createDeviceRecord,
  getDeviceRecords,
  getDeviceRecordById,
  updateDeviceRecord
} = require('../services/deviceService');

const createDevice = async (req, res) => {
  try {
    const device = await createDeviceRecord(req.body);

    return res.status(201).json({
      success: true,
      message: 'Device created successfully',
      data: device
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Failed to create device'
    });
  }
};

const getAllDevices = async (req, res) => {
  try {
    const devices = await getDeviceRecords(req.query);

    return res.status(200).json({
      success: true,
      message: 'Devices retrieved successfully',
      count: devices.length,
      data: devices
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Failed to retrieve devices'
    });
  }
};

const getDeviceById = async (req, res) => {
  try {
    const device = await getDeviceRecordById(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Device retrieved successfully',
      data: device
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Failed to retrieve device'
    });
  }
};

const updateDevice = async (req, res) => {
  try {
    const updatedDevice = await updateDeviceRecord(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: 'Device updated successfully',
      data: updatedDevice
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Failed to update device'
    });
  }
};

module.exports = {
  createDevice,
  getAllDevices,
  getDeviceById,
  updateDevice
};