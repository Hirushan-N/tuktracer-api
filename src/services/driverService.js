const prisma = require('../config/prisma');

const createDriverRecord = async (payload) => {
  const { fullName, nic, phone, licenseNo } = payload;

  if (!fullName || !nic || !phone || !licenseNo) {
    throw {
      status: 400,
      message: 'fullName, nic, phone, and licenseNo are required'
    };
  }

  const existingNic = await prisma.driver.findUnique({
    where: { nic }
  });

  if (existingNic) {
    throw {
      status: 409,
      message: 'Driver with this NIC already exists'
    };
  }

  const existingLicense = await prisma.driver.findUnique({
    where: { licenseNo }
  });

  if (existingLicense) {
    throw {
      status: 409,
      message: 'Driver with this license already exists'
    };
  }

  return prisma.driver.create({
    data: {
      fullName,
      nic,
      phone,
      licenseNo
    }
  });
};

const getDriverRecords = async () => {
  return prisma.driver.findMany({
    include: {
      tukTuks: {
        select: {
          id: true,
          registrationNo: true
        }
      }
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

const getDriverRecordById = async (id) => {
  const driverId = Number(id);

  if (Number.isNaN(driverId)) {
    throw {
      status: 400,
      message: 'Invalid driver id'
    };
  }

  const driver = await prisma.driver.findUnique({
    where: { id: driverId },
    include: {
      tukTuks: true
    }
  });

  if (!driver) {
    throw {
      status: 404,
      message: 'Driver not found'
    };
  }

  return driver;
};

const updateDriverRecord = async (id, payload) => {
  const driverId = Number(id);

  if (Number.isNaN(driverId)) {
    throw {
      status: 400,
      message: 'Invalid driver id'
    };
  }

  const existingDriver = await prisma.driver.findUnique({
    where: { id: driverId }
  });

  if (!existingDriver) {
    throw {
      status: 404,
      message: 'Driver not found'
    };
  }

  const { fullName, nic, phone, licenseNo } = payload;

  if (nic && nic !== existingDriver.nic) {
    const duplicateNic = await prisma.driver.findUnique({
      where: { nic }
    });

    if (duplicateNic) {
      throw {
        status: 409,
        message: 'Another driver with this NIC already exists'
      };
    }
  }

  if (licenseNo && licenseNo !== existingDriver.licenseNo) {
    const duplicateLicense = await prisma.driver.findUnique({
      where: { licenseNo }
    });

    if (duplicateLicense) {
      throw {
        status: 409,
        message: 'Another driver with this license already exists'
      };
    }
  }

  return prisma.driver.update({
    where: { id: driverId },
    data: {
      fullName: fullName ?? existingDriver.fullName,
      nic: nic ?? existingDriver.nic,
      phone: phone ?? existingDriver.phone,
      licenseNo: licenseNo ?? existingDriver.licenseNo
    }
  });
};

module.exports = {
  createDriverRecord,
  getDriverRecords,
  getDriverRecordById,
  updateDriverRecord
};