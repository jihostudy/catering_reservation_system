#!/bin/bash

# 배포용 ZIP 파일 생성 스크립트

echo "📦 배포용 ZIP 파일 생성 중..."

# extension 폴더로 이동
cd "$(dirname "$0")"

# 기존 ZIP 파일 삭제
rm -f catering-extension.zip

# 필수 파일만 ZIP에 포함
zip -r catering-extension.zip \
  manifest.json \
  dist/background.js \
  dist/content.js \
  src/popup/popup.html \
  src/popup/popup.js \
  public/icons/icon16.png \
  public/icons/icon48.png \
  public/icons/icon128.png

echo "✅ catering-extension.zip 생성 완료!"
echo "📁 파일 위치: $(pwd)/catering-extension.zip"

