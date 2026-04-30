const {
  getSystemSummaryData,
  getProvinceSummaryData,
  getInactiveVehiclesData,
  getDistrictSummaryData
} = require('../services/reportService');

const getSystemSummary = async (req, res) => {
  try {
    const data = await getSystemSummaryData();

    return res.status(200).json({
      success: true,
      message: 'System summary retrieved successfully',
      data
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Failed to retrieve system summary'
    });
  }
};

const getProvinceSummary = async (req, res) => {
  try {
    const data = await getProvinceSummaryData();

    return res.status(200).json({
      success: true,
      message: 'Province summary retrieved successfully',
      count: data.length,
      data
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Failed to retrieve province summary'
    });
  }
};

const getInactiveVehicles = async (req, res) => {
  try {
    const result = await getInactiveVehiclesData(req.query.hours);

    return res.status(200).json({
      success: true,
      message: 'Inactive vehicles retrieved successfully',
      filter: {
        inactiveAfterHours: result.hours,
        cutoffTime: result.cutoffTime
      },
      count: result.data.length,
      data: result.data
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Failed to retrieve inactive vehicles'
    });
  }
};

const getDistrictSummary = async (req, res) => {
  try {
    const data = await getDistrictSummaryData();

    return res.status(200).json({
      success: true,
      message: 'District summary retrieved successfully',
      count: data.length,
      data
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Failed to retrieve district summary'
    });
  }
};

module.exports = {
  getSystemSummary,
  getProvinceSummary,
  getInactiveVehicles,
  getDistrictSummary
};