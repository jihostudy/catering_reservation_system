#!/bin/bash

# 배포용 ZIP 파일 생성 스크립트

echo "📦 배포용 ZIP 파일 생성 중..."

# extension 폴더로 이동
cd "$(dirname "$0")"

# 버전 정보 읽기
VERSION=$(node -p "require('./package.json').version")
ZIP_NAME="catering-extension-v${VERSION}.zip"

# 기존 ZIP 파일 삭제
rm -f catering-extension*.zip

# 빌드 확인
if [ ! -d "dist" ]; then
  echo "❌ dist 폴더가 없습니다. 먼저 'pnpm build'를 실행하세요."
  exit 1
fi

# 필수 파일만 ZIP에 포함 (.map 파일 제외)
zip -r "${ZIP_NAME}" \
  manifest.json \
  dist/background.js \
  dist/content.js \
  dist/dashboard-content.js \
  src/popup/popup.html \
  src/popup/popup.js \
  public/icons/icon16.png \
  public/icons/icon48.png \
  public/icons/icon128.png \
  -x "*.map" "*.ts" "node_modules/*" ".git/*"

echo "✅ ${ZIP_NAME} 생성 완료!"
echo "📁 파일 위치: $(pwd)/${ZIP_NAME}"
echo "📌 버전: ${VERSION}"


