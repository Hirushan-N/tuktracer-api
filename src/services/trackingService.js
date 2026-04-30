const prisma = require('../config/prisma');

const createLocationPingRecord = async (payload) => {
  const { deviceCode, apiKey, latitude, longitude, speed, recordedAt } = payload;

  if (!deviceCode || !apiKey || latitude === undefined || longitude === undefined) {
    throw {
      status: 400,
      message: 'deviceCode, apiKey, latitude, and longitude are required'
    };
  }

  const device = await prisma.device.findUnique({
    where: { deviceCode },
    include: {
      tukTuks: true
    }
  });

  if (!device || device.apiKey !== apiKey) {
    throw {
      status: 401,
      message: 'Invalid device credentials'
    };
  }

  if (!device.isActive) {
    throw {
      status: 403,
      message: 'Device is inactive'
    };
  }

  const tukTuk = device.tukTuks[0];

  if (!tukTuk) {
    throw {
      status: 404,
      message: 'No tuk-tuk assigned to this device'
    };
  }

  return prisma.locationLog.create({
    data: {
      tukTukId: tukTuk.id,
      latitude,
      longitude,
      speed: speed !== undefined ? speed : null,
      recordedAt: recordedAt ? new Date(recordedAt) : new Date()
    },
    include: {
      tukTuk: {
        select: {
          id: true,
          registrationNo: true,
          status: true
        }
      }
    }
  });
};

const getLatestLocationByTukTukId = async (id) => {
  const tukTukId = Number(id);

  if (Number.isNaN(tukTukId)) {
    throw {
      status: 400,
      message: 'Invalid tuk-tuk ID'
    };
  }

  const tukTuk = await prisma.tukTuk.findUnique({
    where: { id: tukTukId }
  });

  if (!tukTuk) {
    throw {
      status: 404,
      message: 'Tuk-tuk not found'
    };
  }

  const latestLocation = await prisma.locationLog.findFirst({
    where: { tukTukId },
    orderBy: {
      recordedAt: 'desc'
    }
  });

  if (!latestLocation) {
    throw {
      status: 404,
      message: 'No location records found for this tuk-tuk'
    };
  }

  return latestLocation;
};

const getLocationHistoryByTukTukId = async (id, filters) => {
  const tukTukId = Number(id);
  const { from, to } = filters;

  if (Number.isNaN(tukTukId)) {
    throw {
      status: 400,
      message: 'Invalid tuk-tuk ID'
    };
  }

  const tukTuk = await prisma.tukTuk.findUnique({
    where: { id: tukTukId }
  });

  if (!tukTuk) {
    throw {
      status: 404,
      message: 'Tuk-tuk not found'
    };
  }

  const where = { tukTukId };

  if (from || to) {
    where.recordedAt = {};

    if (from) {
      const fromDate = new Date(from);

      if (Number.isNaN(fromDate.getTime())) {
        throw {
          status: 400,
          message: 'Invalid from date'
        };
      }

      where.recordedAt.gte = fromDate;
    }

    if (to) {
      const toDate = new Date(to);

      if (Number.isNaN(toDate.getTime())) {
        throw {
          status: 400,
          message: 'Invalid to date'
        };
      }

      where.recordedAt.lte = toDate;
    }
  }

  return prisma.locationLog.findMany({
    where,
    orderBy: {
      recordedAt: 'asc'
    }
  });
};

const getLiveLocationRecords = async (filters) => {
  const { provinceId, districtId, stationId } = filters;

  const tukTukWhere = {};

  if (provinceId) tukTukWhere.provinceId = Number(provinceId);
  if (districtId) tukTukWhere.districtId = Number(districtId);
  if (stationId) tukTukWhere.stationId = Number(stationId);

  const tukTuks = await prisma.tukTuk.findMany({
    where: tukTukWhere,
    include: {
      province: true,
      district: true,
      station: true,
      locationLogs: {
        orderBy: {
          recordedAt: 'desc'
        },
        take: 1
      }
    }
  });

  return tukTuks.map((tukTuk) => ({
    id: tukTuk.id,
    registrationNo: tukTuk.registrationNo,
    status: tukTuk.status,
    province: tukTuk.province,
    district: tukTuk.district,
    station: tukTuk.station,
    latestLocation: tukTuk.locationLogs[0] || null
  }));
};

module.exports = {
  createLocationPingRecord,
  getLatestLocationByTukTukId,
  getLocationHistoryByTukTukId,
  getLiveLocationRecords
};