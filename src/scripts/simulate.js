require('dotenv').config();

const prisma = require('../config/prisma');

const PROVINCE_ID = 1;
const DISTRICT_ID = 1;
const STATION_ID = 1;

const TOTAL_TUKTUKS = 200;
const DAYS = 7;
const PINGS_PER_DAY = 10;

// Fixed demo end date: May 2, 2026
// Generated range: April 26, 2026 → May 2, 2026
const BASE_DATE = new Date('2026-05-02T00:00:00Z');

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function generateLocation(baseLat, baseLng) {
  return {
    latitude: baseLat + randomBetween(-0.01, 0.01),
    longitude: baseLng + randomBetween(-0.01, 0.01),
    speed: randomBetween(10, 60)
  };
}

async function clearSimulationData() {
  console.log('Clearing old simulation data...');

  await prisma.locationLog.deleteMany();
  await prisma.tukTuk.deleteMany();
  await prisma.driver.deleteMany();
  await prisma.device.deleteMany();

  console.log('Old simulation data cleared.');
}

async function verifyMasterData() {
  const province = await prisma.province.findUnique({
    where: { id: PROVINCE_ID }
  });

  const district = await prisma.district.findUnique({
    where: { id: DISTRICT_ID }
  });

  const station = await prisma.policeStation.findUnique({
    where: { id: STATION_ID }
  });

  if (!province || !district || !station) {
    throw new Error(
      'Province, district, or station not found. Run npm run seed first, or update PROVINCE_ID, DISTRICT_ID, and STATION_ID.'
    );
  }

  console.log(`Using province: ${province.name}`);
  console.log(`Using district: ${district.name}`);
  console.log(`Using station: ${station.name}`);
}

async function createSimulationData() {
  console.log('Starting TukTracer simulation...');
  console.log('Date range: 2026-04-26 to 2026-05-02');
  console.log(`Tuk-tuks: ${TOTAL_TUKTUKS}`);
  console.log(`Pings per tuk-tuk: ${DAYS * PINGS_PER_DAY}`);

  await verifyMasterData();
  await clearSimulationData();

  const baseLat = 6.9271;
  const baseLng = 79.8612;

  for (let i = 1; i <= TOTAL_TUKTUKS; i += 1) {
    console.log(`Creating tuk-tuk ${i}/${TOTAL_TUKTUKS}`);

    const driver = await prisma.driver.create({
      data: {
        fullName: `Driver ${i}`,
        nic: `SIMNIC${String(i).padStart(5, '0')}`,
        phone: `077${String(1000000 + i)}`,
        licenseNo: `SIMLIC${String(i).padStart(5, '0')}`
      }
    });

    const device = await prisma.device.create({
      data: {
        deviceCode: `SIM-DEV-${String(i).padStart(4, '0')}`,
        apiKey: `SIM-APIKEY-${String(i).padStart(4, '0')}`,
        isActive: true
      }
    });

    const tukTuk = await prisma.tukTuk.create({
      data: {
        registrationNo: `WP-TA-${String(1000 + i)}`,
        model: 'Bajaj RE',
        color: i % 3 === 0 ? 'Yellow' : i % 3 === 1 ? 'Green' : 'Blue',
        status: i % 20 === 0 ? 'INACTIVE' : 'ACTIVE',
        driverId: driver.id,
        deviceId: device.id,
        provinceId: PROVINCE_ID,
        districtId: DISTRICT_ID,
        stationId: STATION_ID
      }
    });

    const logs = [];

    for (let d = DAYS - 1; d >= 0; d -= 1) {
      for (let p = 0; p < PINGS_PER_DAY; p += 1) {
        const recordedAt = new Date(BASE_DATE);
        recordedAt.setUTCDate(BASE_DATE.getUTCDate() - d);
        recordedAt.setUTCHours(8 + p, 0, 0, 0);

        const location = generateLocation(baseLat, baseLng);

        logs.push({
          tukTukId: tukTuk.id,
          latitude: location.latitude,
          longitude: location.longitude,
          speed: location.speed,
          recordedAt
        });
      }
    }

    await prisma.locationLog.createMany({
      data: logs
    });
  }

  const summary = {
    drivers: await prisma.driver.count(),
    devices: await prisma.device.count(),
    tukTuks: await prisma.tukTuk.count(),
    locationLogs: await prisma.locationLog.count()
  };

  console.log('Simulation completed successfully.');
  console.log(summary);
}

createSimulationData()
  .catch((error) => {
    console.error('Simulation failed:', error.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });