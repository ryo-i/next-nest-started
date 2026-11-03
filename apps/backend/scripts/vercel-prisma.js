const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const backendRoot = path.join(__dirname, '..');
const schema = path.join(backendRoot, 'prisma', 'schema.prisma');

if (!fs.existsSync(schema)) {
  process.exit(0);
}

const prismaBin =
  [
    path.join(backendRoot, 'node_modules', '.bin', 'prisma'),
    path.join(backendRoot, '..', '..', 'node_modules', '.bin', 'prisma'),
  ].find((candidate) => fs.existsSync(candidate)) ?? 'prisma';

execFileSync(prismaBin, ['generate', '--schema', schema], {
  stdio: 'inherit',
  cwd: backendRoot,
});

if (process.env.VERCEL !== '1') {
  process.exit(0);
}

const databaseUrl =
  process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL;

if (!databaseUrl) {
  console.warn('DATABASE_URL is not set; skip prisma migrate deploy');
  process.exit(0);
}

execFileSync(prismaBin, ['migrate', 'deploy', '--schema', schema], {
  stdio: 'inherit',
  cwd: backendRoot,
  env: { ...process.env, DATABASE_URL: databaseUrl },
});
