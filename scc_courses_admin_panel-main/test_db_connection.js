// test-connections.js - Run this locally to isolate the issue
const { PrismaClient } = require('./lib/generated/prisma');

async function testConnections() {
  console.log('🔍 Testing Database Connections...\n');

  // Test 1: Direct Connection
  console.log('📋 Test 1: Direct Connection');
  const directPrisma = new PrismaClient({
    datasources: {
      db: {
        url: "DIRECT CONNECTION URL"
      }
    },
    log: ['error'],
  });

  try {
    await directPrisma.$connect();
    const directCount = await directPrisma.profile.count();
    console.log('✅ Direct connection SUCCESS - Profile count:', directCount);
    await directPrisma.$disconnect();
  } catch (error) {
    console.log('❌ Direct connection FAILED:', error.message);
  }

  // Test 2: Accelerate Connection
  console.log('\n📋 Test 2: Accelerate Connection');
  const acceleratePrisma = new PrismaClient({
    datasources: {
      db: {
        url: "ACCELLERATE API_KEY URL"
      }
    },
    log: ['error'],
  });

  try {
    await acceleratePrisma.$connect();
    const accelerateCount = await acceleratePrisma.profile.count();
    console.log('✅ Accelerate connection SUCCESS - Profile count:', accelerateCount);
    await acceleratePrisma.$disconnect();
  } catch (error) {
    console.log('❌ Accelerate connection FAILED:', error.message);
    console.log('   Error details:', error.code || 'No error code');
  }

  // Test 3: Schema Introspection via Accelerate
  console.log('\n📋 Test 3: Schema Check via Accelerate');
  try {
    const tables = await acceleratePrisma.$queryRaw`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name = 'profiles';
    `;
    console.log('✅ Accelerate schema check SUCCESS:', tables);
  } catch (error) {
    console.log('❌ Accelerate schema check FAILED:', error.message);
  }

  console.log('\n🏁 Test completed');
}

testConnections().catch(console.error);