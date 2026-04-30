const {
  getProvinceRecords,
  getDistrictRecords,
  getStationRecords,
  getDistrictRecordsByProvince,
  getStationRecordsByDistrict
} = require('../services/locationService');

const getAllProvinces = async (req, res) => {
  try {
    const provinces = await getProvinceRecords();

    return res.status(200).json({
      success: true,
      message: 'Provinces retrieved successfully',
      count: provinces.length,
      data: provinces
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Failed to retrieve provinces'
    });
  }
};

const getAllDistricts = async (req, res) => {
  try {
    const districts = await getDistrictRecords();

    return res.status(200).json({
      success: true,
      message: 'Districts retrieved successfully',
      count: districts.length,
      data: districts
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Failed to retrieve districts'
    });
  }
};

const getAllStations = async (req, res) => {
  try {
    const stations = await getStationRecords();

    return res.status(200).json({
      success: true,
      message: 'Police stations retrieved successfully',
      count: stations.length,
      data: stations
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Failed to retrieve police stations'
    });
  }
};

const getDistrictsByProvince = async (req, res) => {
  try {
    const districts = await getDistrictRecordsByProvince(req.params.provinceId);

    return res.status(200).json({
      success: true,
      message: 'Districts by province retrieved successfully',
      count: districts.length,
      data: districts
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Failed to retrieve districts by province'
    });
  }
};

const getStationsByDistrict = async (req, res) => {
  try {
    const stations = await getStationRecordsByDistrict(req.params.districtId);

    return res.status(200).json({
      success: true,
      message: 'Police stations by district retrieved successfully',
      count: stations.length,
      data: stations
    });
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || 'Failed to retrieve police stations by district'
    });
  }
};

module.exports = {
  getAllProvinces,
  getAllDistricts,
  getAllStations,
  getDistrictsByProvince,
  getStationsByDistrict
};