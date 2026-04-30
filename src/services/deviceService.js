const crypto = require('crypto');
const prisma = require('../config/prisma');

const generateApiKey = () => {
  return crypto.randomBytes(24).toString('hex');
};

const createDeviceRecord = async (payload) => {
  const { deviceCode, apiKey, isActive } = payload;

  if (!deviceCode) {
    throw {
      status: 400,
      message: 'deviceCode is required'
    };
  }

  const existingDevice = await prisma.device.findUnique({
    where: { deviceCode }
  });

  if (existingDevice) {
    throw {
      status: 409,
      message: 'Device with this deviceCode already exists'
    };
  }

  const finalApiKey = apiKey || generateApiKey();

  const existingApiKey = await prisma.device.findUnique({
    where: { apiKey: finalApiKey }
  });

  if (existingApiKey) {
    throw {
      status: 409,
      message: 'Device with this apiKey already exists'
    };
  }

  return prisma.device.create({
    data: {
      deviceCode,
      apiKey: finalApiKey,
      isActive: isActive !== undefined ? Boolean(isActive) : true
    }
  });
};

const getDeviceRecords = async (filters = {}) => {
  const { search, isActive } = filters;

  const where = {};

  if (search) {
    where.deviceCode = {
      contains: search,
      mode: 'insensitive'
    };
  }

  if (isActive !== undefined) {
    where.isActive = isActive === 'true' || isActive === true;
  }

  return prisma.device.findMany({
    where,
    include: {
      tukTuks: {
        select: {
          id: true,
          registrationNo: true,
          status: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

const getDeviceRecordById = async (id) => {
  const deviceId = Number(id);

  if (Number.isNaN(deviceId)) {
    throw {
      status: 400,
      message: 'Invalid device id'
    };
  }

  const device = await prisma.device.findUnique({
    where: { id: deviceId },
    include: {
      tukTuks: {
        select: {
          id: true,
          registrationNo: true,
          model: true,
          color: true,
          status: true
        }
      }
    }
  });

  if (!device) {
    throw {
      status: 404,
      message: 'Device not found'
    };
  }

  return device;
};

const updateDeviceRecord = async (id, payload) => {
  const deviceId = Number(id);

  if (Number.isNaN(deviceId)) {
    throw {
      status: 400,
      message: 'Invalid device id'
    };
  }

  const existingDevice = await prisma.device.findUnique({
    where: { id: deviceId }
  });

  if (!existingDevice) {
    throw {
      status: 404,
      message: 'Device not found'
    };
  }

  const { deviceCode, apiKey, isActive } = payload;

  if (deviceCode && deviceCode !== existingDevice.deviceCode) {
    const duplicateDeviceCode = await prisma.device.findUnique({
      where: { deviceCode }
    });

    if (duplicateDeviceCode) {
      throw {
        status: 409,
        message: 'Another device with this deviceCode already exists'
      };
    }
  }

  if (apiKey && apiKey !== existingDevice.apiKey) {
    const duplicateApiKey = await prisma.device.findUnique({
      where: { apiKey }
    });

    if (duplicateApiKey) {
      throw {
        status: 409,
        message: 'Another device with this apiKey already exists'
      };
    }
  }

  return prisma.device.update({
    where: { id: deviceId },
    data: {
      deviceCode: deviceCode ?? existingDevice.deviceCode,
      apiKey: apiKey ?? existingDevice.apiKey,
      isActive:
        isActive !== undefined
          ? isActive === true || isActive === 'true'
          : existingDevice.isActive
    }
  });
};

module.exports = {
  createDeviceRecord,
  getDeviceRecords,
  getDeviceRecordById,
  updateDeviceRecord
};