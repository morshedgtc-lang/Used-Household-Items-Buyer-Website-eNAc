const { PrismaClient } = require('@prisma/client');

const ref = 'lkbjfupcjqfdfuwdqgid';
const pw = 'RPEs45ikOWr6h41j';
const regions = [
  'us-east-1', 'us-west-1', 'us-west-2',
  'ap-southeast-1', 'ap-northeast-1', 'ap-northeast-2',
  'ap-southeast-2', 'ap-south-1',
  'eu-west-1', 'eu-west-2', 'eu-west-3', 'eu-central-1',
  'ca-central-1', 'sa-east-1'
];
const users = ['postgres', `postgres.${ref}`];

(async () => {
  for (const region of regions) {
    for (const user of users) {
      const url = `postgresql://${user}:${pw}@aws-0-${region}.pooler.supabase.com:6543/postgres`;
      const prisma = new PrismaClient({ datasources: { db: { url } }, log: [] });
      try {
        await prisma.$queryRaw`SELECT 1`;
        console.log('SUCCESS_REGION=' + region + ' USER=' + user);
        console.log('SUCCESS_URL=' + url);
        await prisma.$disconnect();
        process.exit(0);
      } catch (e) {
        // do nothing
      }
    }
  }
  console.log('NO_REGION_MATCHED');
  process.exit(1);
})();