const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

/**
 * Makes the bot friendly to hosting panels that start `node index.js`
 * without running `npm install` first.
 *
 * It checks the dependencies declared in package.json and installs them
 * automatically when they are missing. This is intentionally synchronous so
 * the rest of the application cannot load before dependencies are ready.
 */
function ensureDependencies() {
  const root = path.resolve(__dirname, '..');
  const packageFile = path.join(root, 'package.json');

  if (!fs.existsSync(packageFile)) return;

  let pkg;
  try {
    pkg = JSON.parse(fs.readFileSync(packageFile, 'utf8'));
  } catch (error) {
    console.error('[MULLER BOT] Cannot read package.json:', error.message);
    return;
  }

  const dependencies = Object.keys(pkg.dependencies || {});
  const missing = [];

  for (const dependency of dependencies) {
    try {
      require.resolve(dependency, { paths: [root] });
    } catch (_) {
      missing.push(dependency);
    }
  }

  if (!missing.length) return;

  console.log('');
  console.log('📦 MULLER BOT: Missing Node.js dependencies detected.');
  console.log(`   Missing: ${missing.join(', ')}`);
  console.log('   Installing dependencies automatically...');
  console.log('');

  const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const result = spawnSync(
    npm,
    ['install', '--omit=dev', '--no-audit', '--no-fund'],
    {
      cwd: root,
      stdio: 'inherit',
      env: process.env,
    }
  );

  if (result.error) {
    console.error('❌ Could not start npm:', result.error.message);
    console.error('Please enable npm/package installation for this server.');
    process.exit(1);
  }

  if (result.status !== 0) {
    console.error(`❌ npm install failed with exit code ${result.status}.`);
    console.error('The bot cannot start until its dependencies are installed.');
    process.exit(result.status || 1);
  }

  // Verify again after installation so the user gets a useful error.
  const stillMissing = [];
  for (const dependency of dependencies) {
    try {
      require.resolve(dependency, { paths: [root] });
    } catch (_) {
      stillMissing.push(dependency);
    }
  }

  if (stillMissing.length) {
    console.error('❌ These dependencies are still unavailable:', stillMissing.join(', '));
    process.exit(1);
  }

  console.log('✅ Dependencies installed successfully.');
  console.log('');
}

module.exports = { ensureDependencies };
