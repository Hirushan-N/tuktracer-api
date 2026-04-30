const {
  createDriverRecord,
  getDriverRecords,
  getDriverRecordById,
  updateDriverRecord
} = require('../services/driverService');

const createDriver = async (req, res) => {
  try {
    const driver = await createDriverRecord(req.body);

    return res.status(201).json({
      success: true,
      message: 'Driver created successfully',
      data: driver
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Failed to create driver'
    });
  }
};

const getAllDrivers = async (req, res) => {
  try {
    const drivers = await getDriverRecords();

    return res.status(200).json({
      success: true,
      message: 'Drivers retrieved successfully',
      count: drivers.length,
      data: drivers
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Failed to retrieve drivers'
    });
  }
};

const getDriverById = async (req, res) => {
  try {
    const driver = await getDriverRecordById(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Driver retrieved successfully',
      data: driver
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Failed to retrieve driver'
    });
  }
};

const updateDriver = async (req, res) => {
  try {
    const updatedDriver = await updateDriverRecord(req.params.id, req.body);

    return res.status(200).json({
      success: true,
      message: 'Driver updated successfully',
      data: updatedDriver
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Failed to update driver'
    });
  }
};

module.exports = {
  createDriver,
  getAllDrivers,
  getDriverById,
  updateDriver
};