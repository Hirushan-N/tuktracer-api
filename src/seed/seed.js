require('dotenv').config();

const bcrypt = require('bcrypt');
const prisma = require('../config/prisma');
const provinces = require('./provinces');
const districts = require('./districts');
const stations = require('./stations');

async function seedProvinces() {
  console.log('Seeding provinces...');

  for (const province of provinces) {
    await prisma.province.upsert({
      where: { name: province.name },
      update: {},
      create: {
        name: province.name
      }
    });
  }

  console.log(`Seeded ${provinces.length} provinces`);
}

async function seedDistricts() {
  console.log('Seeding districts...');

  for (const district of districts) {
    const province = await prisma.province.findUnique({
      where: { name: district.provinceName }
    });

    if (!province) {
      throw new Error(`Province not found for district: ${district.name}`);
    }

    await prisma.district.upsert({
      where: {
        name_provinceId: {
          name: district.name,
          provinceId: province.id
        }
      },
      update: {},
      create: {
        name: district.name,
        provinceId: province.id
      }
    });
  }

  console.log(`Seeded ${districts.length} districts`);
}

async function seedStations() {
  console.log('Seeding police stations...');

  for (const station of stations) {
    const district = await prisma.district.findFirst({
      where: { name: station.districtName }
    });

    if (!district) {
      throw new Error(`District not found for station: ${station.name}`);
    }

    await prisma.policeStation.upsert({
      where: {
        name_districtId: {
          name: station.name,
          districtId: district.id
        }
      },
      update: {},
      create: {
        name: station.name,
        districtId: district.id
      }
    });
  }

  console.log(`Seeded ${stations.length} police stations`);
}

async function seedUsers() {
  console.log('Seeding users...');

  const hashedPassword = await bcrypt.hash('Admin@123', 10);

  const westernProvince = await prisma.province.findUnique({
    where: { name: 'Western' }
  });

  const colomboDistrict = await prisma.district.findFirst({
    where: { name: 'Colombo' }
  });

  const colomboStation = await prisma.policeStation.findFirst({
    where: { name: 'Colombo Fort Police Station' }
  });

  await prisma.user.upsert({
    where: { email: 'hqadmin@tuktracer.lk' },
    update: {},
    create: {
      name: 'HQ Admin',
      email: 'hqadmin@tuktracer.lk',
      password: hashedPassword,
      role: 'HQ_ADMIN'
    }
  });

  await prisma.user.upsert({
    where: { email: 'westernadmin@tuktracer.lk' },
    update: {},
    create: {
      name: 'Western Province Admin',
      email: 'westernadmin@tuktracer.lk',
      password: hashedPassword,
      role: 'PROVINCIAL_ADMIN',
      provinceId: westernProvince?.id
    }
  });

  await prisma.user.upsert({
    where: { email: 'colomboofficer@tuktracer.lk' },
    update: {},
    create: {
      name: 'Colombo District Officer',
      email: 'colomboofficer@tuktracer.lk',
      password: hashedPassword,
      role: 'DISTRICT_OFFICER',
      provinceId: westernProvince?.id,
      districtId: colomboDistrict?.id
    }
  });

  await prisma.user.upsert({
    where: { email: 'fortstation@tuktracer.lk' },
    update: {},
    create: {
      name: 'Colombo Fort Station Officer',
      email: 'fortstation@tuktracer.lk',
      password: hashedPassword,
      role: 'STATION_OFFICER',
      provinceId: westernProvince?.id,
      districtId: colomboDistrict?.id,
      stationId: colomboStation?.id
    }
  });

  console.log('Seeded 4 users');
  console.log('Login password for all seeded users: Admin@123');
}

async function showCounts() {
  const provinceCount = await prisma.province.count();
  const districtCount = await prisma.district.count();
  const stationCount = await prisma.policeStation.count();
  const userCount = await prisma.user.count();

  console.log('--- Seed Summary ---');
  console.log(`Provinces: ${provinceCount}`);
  console.log(`Districts: ${districtCount}`);
  console.log(`Police Stations: ${stationCount}`);
  console.log(`Users: ${userCount}`);
}

async function main() {
  try {
    console.log('Starting seed process...\n');

    await seedProvinces();
    await seedDistricts();
    await seedStations();
    await seedUsers();
    await showCounts();

    console.log('\nSeed process completed successfully.');
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();