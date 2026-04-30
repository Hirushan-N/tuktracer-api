const prisma = require('../config/prisma');

const getProvinceRecords = async () => {
  return prisma.province.findMany({
    orderBy: {
      name: 'asc'
    }
  });
};

const getDistrictRecords = async () => {
  return prisma.district.findMany({
    include: {
      province: true
    },
    orderBy: {
      name: 'asc'
    }
  });
};

const getStationRecords = async () => {
  return prisma.policeStation.findMany({
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
};

const getDistrictRecordsByProvince = async (id) => {
  const provinceId = Number(id);

  if (Number.isNaN(provinceId)) {
    throw {
      status: 400,
      message: 'Invalid province id'
    };
  }

  const province = await prisma.province.findUnique({
    where: { id: provinceId }
  });

  if (!province) {
    throw {
      status: 404,
      message: 'Province not found'
    };
  }

  return prisma.district.findMany({
    where: {
      provinceId
    },
    orderBy: {
      name: 'asc'
    }
  });
};

const getStationRecordsByDistrict = async (id) => {
  const districtId = Number(id);

  if (Number.isNaN(districtId)) {
    throw {
      status: 400,
      message: 'Invalid district id'
    };
  }

  const district = await prisma.district.findUnique({
    where: { id: districtId }
  });

  if (!district) {
    throw {
      status: 404,
      message: 'District not found'
    };
  }

  return prisma.policeStation.findMany({
    where: {
      districtId
    },
    orderBy: {
      name: 'asc'
    }
  });
};

module.exports = {
  getProvinceRecords,
  getDistrictRecords,
  getStationRecords,
  getDistrictRecordsByProvince,
  getStationRecordsByDistrict
};