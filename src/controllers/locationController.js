const prisma = require('../config/prisma');

const getAllProvinces = async (req, res) => {
  try {
    const provinces = await prisma.province.findMany({
      orderBy: {
        name: 'asc'
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Provinces retrieved successfully',
      data: provinces
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve provinces',
      error: error.message
    });
  }
};

const getAllDistricts = async (req, res) => {
  try {
    const districts = await prisma.district.findMany({
      include: {
        province: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Districts retrieved successfully',
      data: districts
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve districts',
      error: error.message
    });
  }
};

const getAllStations = async (req, res) => {
  try {
    const stations = await prisma.policeStation.findMany({
      include: {
        district: {
          include: {
            province: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Police stations retrieved successfully',
      data: stations
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve police stations',
      error: error.message
    });
  }
};

const getDistrictsByProvince = async (req, res) => {
  try {
    const provinceId = Number(req.params.provinceId);

    if (Number.isNaN(provinceId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid province id'
      });
    }

    const districts = await prisma.district.findMany({
      where: {
        provinceId
      },
      orderBy: {
        name: 'asc'
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Districts by province retrieved successfully',
      data: districts
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve districts by province',
      error: error.message
    });
  }
};

const getStationsByDistrict = async (req, res) => {
  try {
    const districtId = Number(req.params.districtId);

    if (Number.isNaN(districtId)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid district id'
      });
    }

    const stations = await prisma.policeStation.findMany({
      where: {
        districtId
      },
      orderBy: {
        name: 'asc'
      }
    });

    return res.status(200).json({
      success: true,
      message: 'Police stations by district retrieved successfully',
      data: stations
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve police stations by district',
      error: error.message
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