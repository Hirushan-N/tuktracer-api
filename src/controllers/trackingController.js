const {
  createLocationPingRecord,
  getLatestLocationByTukTukId,
  getLocationHistoryByTukTukId,
  getLiveLocationRecords
} = require('../services/trackingService');

const createLocationPing = async (req, res) => {
  try {
    const locationLog = await createLocationPingRecord(req.body);

    return res.status(201).json({
      success: true,
      message: 'Location ping recorded successfully',
      data: locationLog
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Failed to record location ping'
    });
  }
};

const getLatestLocation = async (req, res) => {
  try {
    const latestLocation = await getLatestLocationByTukTukId(req.params.tukTukId);

    return res.status(200).json({
      success: true,
      message: 'Latest location retrieved successfully',
      data: latestLocation
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Failed to retrieve latest location'
    });
  }
};

const getLocationHistory = async (req, res) => {
  try {
    const history = await getLocationHistoryByTukTukId(
      req.params.tukTukId,
      req.query
    );

    return res.status(200).json({
      success: true,
      message: 'Location history retrieved successfully',
      count: history.length,
      data: history
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Failed to retrieve location history'
    });
  }
};

const getLiveLocations = async (req, res) => {
  try {
    const liveLocations = await getLiveLocationRecords(req.query);

    return res.status(200).json({
      success: true,
      message: 'Live locations retrieved successfully',
      count: liveLocations.length,
      data: liveLocations
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Failed to retrieve live locations'
    });
  }
};

module.exports = {
  createLocationPing,
  getLatestLocation,
  getLocationHistory,
  getLiveLocations
};