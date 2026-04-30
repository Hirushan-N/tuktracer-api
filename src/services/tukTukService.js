const prisma = require('../config/prisma');

const tukTukInclude = {
  driver: true,
  device: true,
  province: true,
  district: true,
  station: true
};

const validateRegion = async (provinceId, districtId, stationId) => {
  const province = await prisma.province.findUnique({
    where: { id: Number(provinceId) }
  });

  const district = await prisma.district.findUnique({
    where: { id: Number(districtId) }
  });

  const station = await prisma.policeStation.findUnique({
    where: { id: Number(stationId) }
  });

  if (!province || !district || !station) {
    throw {
      status: 400,
      message: 'Invalid province, district, or station'
    };
  }

  if (district.provinceId !== Number(provinceId)) {
    throw {
      status: 400,
      message: 'Selected district does not belong to selected province'
    };
  }

  if (station.districtId !== Number(districtId)) {
    throw {
      status: 400,
      message: 'Selected station does not belong to selected district'
    };
  }
};

const validateDriver = async (driverId) => {
  if (!driverId) return;

  const driver = await prisma.driver.findUnique({
    where: { id: Number(driverId) }
  });

  if (!driver) {
    throw {
      status: 400,
      message: 'Invalid driverId'
    };
  }
};

const validateDevice = async (deviceId) => {
  if (!deviceId) return;

  const device = await prisma.device.findUnique({
    where: { id: Number(deviceId) }
  });

  if (!device) {
    throw {
      status: 400,
      message: 'Invalid deviceId'
    };
  }
};

const createTukTukRecord = async (payload) => {
  const {
    registrationNo,
    model,
    color,
    status,
    driverId,
    deviceId,
    provinceId,
    districtId,
    stationId
  } = payload;

  if (!registrationNo || !provinceId || !districtId || !stationId) {
    throw {
      status: 400,
      message: 'registrationNo, provinceId, districtId, and stationId are required'
    };
  }

  const existingTukTuk = await prisma.tukTuk.findUnique({
    where: { registrationNo }
  });

  if (existingTukTuk) {
    throw {
      status: 409,
      message: 'Tuk-tuk with this registration number already exists'
    };
  }

  await validateRegion(provinceId, districtId, stationId);
  await validateDriver(driverId);
  await validateDevice(deviceId);

  return prisma.tukTuk.create({
    data: {
      registrationNo,
      model: model || null,
      color: color || null,
      status: status || 'ACTIVE',
      driverId: driverId ? Number(driverId) : null,
      deviceId: deviceId ? Number(deviceId) : null,
      provinceId: Number(provinceId),
      districtId: Number(districtId),
      stationId: Number(stationId)
    },
    include: tukTukInclude
  });
};

const getTukTukRecords = async (filters) => {
  const { provinceId, districtId, stationId, status, registrationNo } = filters;

  const where = {};

  if (provinceId) where.provinceId = Number(provinceId);
  if (districtId) where.districtId = Number(districtId);
  if (stationId) where.stationId = Number(stationId);
  if (status) where.status = status;

  if (registrationNo) {
    where.registrationNo = {
      contains: registrationNo,
      mode: 'insensitive'
    };
  }

  return prisma.tukTuk.findMany({
    where,
    include: tukTukInclude,
    orderBy: {
      createdAt: 'desc'
    }
  });
};

const getTukTukRecordById = async (id) => {
  const tukTukId = Number(id);

  if (Number.isNaN(tukTukId)) {
    throw {
      status: 400,
      message: 'Invalid tuk-tuk id'
    };
  }

  const tukTuk = await prisma.tukTuk.findUnique({
    where: { id: tukTukId },
    include: {
      ...tukTukInclude,
      locationLogs: {
        orderBy: {
          recordedAt: 'desc'
        },
        take: 5
      }
    }
  });

  if (!tukTuk) {
    throw {
      status: 404,
      message: 'Tuk-tuk not found'
    };
  }

  return tukTuk;
};

const updateTukTukRecord = async (id, payload) => {
  const tukTukId = Number(id);

  if (Number.isNaN(tukTukId)) {
    throw {
      status: 400,
      message: 'Invalid tuk-tuk id'
    };
  }

  const existingTukTuk = await prisma.tukTuk.findUnique({
    where: { id: tukTukId }
  });

  if (!existingTukTuk) {
    throw {
      status: 404,
      message: 'Tuk-tuk not found'
    };
  }

  const {
    registrationNo,
    model,
    color,
    status,
    driverId,
    deviceId,
    provinceId,
    districtId,
    stationId
  } = payload;

  if (registrationNo && registrationNo !== existingTukTuk.registrationNo) {
    const duplicate = await prisma.tukTuk.findUnique({
      where: { registrationNo }
    });

    if (duplicate) {
      throw {
        status: 409,
        message: 'Another tuk-tuk with this registration number already exists'
      };
    }
  }

  const finalProvinceId =
    provinceId !== undefined ? Number(provinceId) : existingTukTuk.provinceId;
  const finalDistrictId =
    districtId !== undefined ? Number(districtId) : existingTukTuk.districtId;
  const finalStationId =
    stationId !== undefined ? Number(stationId) : existingTukTuk.stationId;

  await validateRegion(finalProvinceId, finalDistrictId, finalStationId);
  await validateDriver(driverId);
  await validateDevice(deviceId);

  return prisma.tukTuk.update({
    where: { id: tukTukId },
    data: {
      registrationNo: registrationNo ?? existingTukTuk.registrationNo,
      model: model !== undefined ? model : existingTukTuk.model,
      color: color !== undefined ? color : existingTukTuk.color,
      status: status ?? existingTukTuk.status,
      driverId:
        driverId !== undefined
          ? driverId
            ? Number(driverId)
            : null
          : existingTukTuk.driverId,
      deviceId:
        deviceId !== undefined
          ? deviceId
            ? Number(deviceId)
            : null
          : existingTukTuk.deviceId,
      provinceId: finalProvinceId,
      districtId: finalDistrictId,
      stationId: finalStationId
    },
    include: tukTukInclude
  });
};

const deleteTukTukRecord = async (id) => {
  const tukTukId = Number(id);

  if (Number.isNaN(tukTukId)) {
    throw {
      status: 400,
      message: 'Invalid tuk-tuk id'
    };
  }

  const existingTukTuk = await prisma.tukTuk.findUnique({
    where: { id: tukTukId }
  });

  if (!existingTukTuk) {
    throw {
      status: 404,
      message: 'Tuk-tuk not found'
    };
  }

  await prisma.tukTuk.delete({
    where: { id: tukTukId }
  });

  return true;
};

module.exports = {
  createTukTukRecord,
  getTukTukRecords,
  getTukTukRecordById,
  updateTukTukRecord,
  deleteTukTukRecord
};