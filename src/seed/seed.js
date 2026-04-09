require('dotenv').config();

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

async function showCounts() {
  const provinceCount = await prisma.province.count();
  const districtCount = await prisma.district.count();
  const stationCount = await prisma.policeStation.count();

  console.log('--- Seed Summary ---');
  console.log(`Provinces: ${provinceCount}`);
  console.log(`Districts: ${districtCount}`);
  console.log(`Police Stations: ${stationCount}`);
}

async function main() {
  try {
    console.log('Starting seed process...\n');

    await seedProvinces();
    await seedDistricts();
    await seedStations();
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