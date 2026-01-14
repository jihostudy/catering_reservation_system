#!/usr/bin/env node

/**
 * package.json과 manifest.json의 버전을 동기화하는 스크립트
 * 
 * 사용법:
 *   node scripts/version-sync.js <version>
 *   예: node scripts/version-sync.js 1.0.1
 */

const fs = require('fs');
const path = require('path');

const version = process.argv[2];

if (!version) {
  console.error('❌ 버전을 입력해주세요.');
  console.log('사용법: node scripts/version-sync.js <version>');
  console.log('예: node scripts/version-sync.js 1.0.1');
  process.exit(1);
}

// 버전 형식 검증 (semver)
const semverRegex = /^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$/;
if (!semverRegex.test(version)) {
  console.error('❌ 올바른 버전 형식이 아닙니다. (예: 1.0.0, 1.0.1-beta)');
  process.exit(1);
}

const extensionDir = path.resolve(__dirname, '..');
const packageJsonPath = path.join(extensionDir, 'package.json');
const manifestJsonPath = path.join(extensionDir, 'manifest.json');

// package.json 업데이트
try {
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  packageJson.version = version;
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
  console.log(`✅ package.json 버전 업데이트: ${version}`);
} catch (error) {
  console.error('❌ package.json 업데이트 실패:', error.message);
  process.exit(1);
}

// manifest.json 업데이트
try {
  const manifestJson = JSON.parse(fs.readFileSync(manifestJsonPath, 'utf8'));
  manifestJson.version = version;
  fs.writeFileSync(manifestJsonPath, JSON.stringify(manifestJson, null, 2) + '\n');
  console.log(`✅ manifest.json 버전 업데이트: ${version}`);
} catch (error) {
  console.error('❌ manifest.json 업데이트 실패:', error.message);
  process.exit(1);
}

console.log(`\n🎉 버전 동기화 완료: ${version}`);
