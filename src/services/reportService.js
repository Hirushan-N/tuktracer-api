const prisma = require('../config/prisma');

const getSystemSummaryData = async () => {
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

  return {
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
  };
};

const getProvinceSummaryData = async () => {
  const provinces = await prisma.province.findMany({
    include: {
      districts: true,
      tukTuks: true
    },
    orderBy: {
      name: 'asc'
    }
  });

  return provinces.map((province) => {
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
};

const getInactiveVehiclesData = async (hoursParam) => {
  const hours = Number(hoursParam || 6);

  if (Number.isNaN(hours) || hours <= 0) {
    throw {
      status: 400,
      message: 'hours must be a positive number'
    };
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

  return {
    hours,
    cutoffTime,
    data: inactiveVehicles
  };
};

const getDistrictSummaryData = async () => {
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

  return districts.map((district) => {
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
};

module.exports = {
  getSystemSummaryData,
  getProvinceSummaryData,
  getInactiveVehiclesData,
  getDistrictSummaryData
};