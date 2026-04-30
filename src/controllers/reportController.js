const prisma = require('../config/prisma');

const getSystemSummary = async (req, res) => {
  try {
    const [
      totalTukTuks,
      activeTukTuks,
      inactiveTukTuks,
      suspendedTukTuks,
      totalDrivers,
      totalDevices,
      activeDevices,
      totalLocationLogs,
      totalProvinces,
      totalDistricts,
      totalStations
    ] = await Promise.all([
      prisma.tukTuk.count(),
      prisma.tukTuk.count({ where: { status: 'ACTIVE' } }),
      prisma.tukTuk.count({ where: { status: 'INACTIVE' } }),
      prisma.tukTuk.count({ where: { status: 'SUSPENDED' } }),
      prisma.driver.count(),
      prisma.device.count(),
      prisma.device.count({ where: { isActive: true } }),
      prisma.locationLog.count(),
      prisma.province.count(),
      prisma.district.count(),
      prisma.policeStation.count()
    ]);

    return res.status(200).json({
      success: true,
      message: 'System summary retrieved successfully',
      data: {
        tukTuks: {
          total: totalTukTuks,
          active: activeTukTuks,
          inactive: inactiveTukTuks,
          suspended: suspendedTukTuks
        },
        drivers: {
          total: totalDrivers
        },
        devices: {
          total: totalDevices,
          active: activeDevices,
          inactive: totalDevices - activeDevices
        },
        locationLogs: {
          total: totalLocationLogs
        },
        administrativeData: {
          provinces: totalProvinces,
          districts: totalDistricts,
          policeStations: totalStations
        }
      }
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve system summary',
      error: error.message
    });
  }
};

const getProvinceSummary = async (req, res) => {
  try {
    const provinces = await prisma.province.findMany({
      include: {
        districts: true,
        tukTuks: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    const summary = provinces.map((province) => {
      const total = province.tukTuks.length;
      const active = province.tukTuks.filter((t) => t.status === 'ACTIVE').length;
      const inactive = province.tukTuks.filter((t) => t.status === 'INACTIVE').length;
      const suspended = province.tukTuks.filter((t) => t.status === 'SUSPENDED').length;

      return {
        provinceId: province.id,
        provinceName: province.name,
        districtCount: province.districts.length,
        tukTuks: {
          total,
          active,
          inactive,
          suspended
        }
      };
    });

    return res.status(200).json({
      success: true,
      message: 'Province summary retrieved successfully',
      count: summary.length,
      data: summary
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve province summary',
      error: error.message
    });
  }
};

const getInactiveVehicles = async (req, res) => {
  try {
    const hours = Number(req.query.hours || 6);

    if (Number.isNaN(hours) || hours <= 0) {
      return res.status(400).json({
        success: false,
        message: 'hours must be a positive number'
      });
    }

    const cutoffTime = new Date(Date.now() - hours * 60 * 60 * 1000);

    const tukTuks = await prisma.tukTuk.findMany({
      include: {
        province: true,
        district: true,
        station: true,
        device: true,
        driver: true,
        locationLogs: {
          orderBy: {
            recordedAt: 'desc'
          },
          take: 1
        }
      },
      orderBy: {
        registrationNo: 'asc'
      }
    });

    const inactiveVehicles = tukTuks
      .map((tukTuk) => {
        const latestLocation = tukTuk.locationLogs[0] || null;

        return {
          id: tukTuk.id,
          registrationNo: tukTuk.registrationNo,
          status: tukTuk.status,
          province: tukTuk.province,
          district: tukTuk.district,
          station: tukTuk.station,
          driver: tukTuk.driver,
          device: tukTuk.device,
          latestLocation,
          reason:
            !latestLocation
              ? 'No location pings recorded'
              : latestLocation.recordedAt < cutoffTime
                ? `No location update within last ${hours} hours`
                : null
        };
      })
      .filter((vehicle) => vehicle.reason !== null);

    return res.status(200).json({
      success: true,
      message: 'Inactive vehicles retrieved successfully',
      filter: {
        inactiveAfterHours: hours,
        cutoffTime
      },
      count: inactiveVehicles.length,
      data: inactiveVehicles
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve inactive vehicles',
      error: error.message
    });
  }
};

const getDistrictSummary = async (req, res) => {
  try {
    const districts = await prisma.district.findMany({
      include: {
        province: true,
        stations: true,
        tukTuks: true
      },
      orderBy: {
        name: 'asc'
      }
    });

    const summary = districts.map((district) => {
      const total = district.tukTuks.length;
      const active = district.tukTuks.filter((t) => t.status === 'ACTIVE').length;
      const inactive = district.tukTuks.filter((t) => t.status === 'INACTIVE').length;
      const suspended = district.tukTuks.filter((t) => t.status === 'SUSPENDED').length;

      return {
        districtId: district.id,
        districtName: district.name,
        province: district.province,
        policeStationCount: district.stations.length,
        tukTuks: {
          total,
          active,
          inactive,
          suspended
        }
      };
    });

    return res.status(200).json({
      success: true,
      message: 'District summary retrieved successfully',
      count: summary.length,
      data: summary
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve district summary',
      error: error.message
    });
  }
};

module.exports = {
  getSystemSummary,
  getProvinceSummary,
  getInactiveVehicles,
  getDistrictSummary
};