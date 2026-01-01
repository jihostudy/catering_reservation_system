# Chrome Web Store 배포 가이드

## 🚀 빠른 배포 가이드

### 1단계: 빌드

```bash
cd extension
pnpm build
```

### 2단계: ZIP 파일 생성

```bash
# 스크립트 실행
./create-zip.sh

# 또는 수동으로
zip -r catering-extension.zip \
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
```

### 3단계: Chrome Web Store 개발자 등록

1. **Chrome Web Store 개발자 콘솔 접속**
   - https://chrome.google.com/webstore/devconsole
   - Google 계정으로 로그인

2. **$5 등록비 결제** (일회성, 평생 유효)
   - 개발자 계정 등록 시 필요

3. **새 항목 추가**
   - "새 항목" 버튼 클릭
   - `catering-extension.zip` 파일 업로드

### 4단계: 스토어 정보 입력

#### 필수 항목:

1. **이름**: `Catering Auto Reservation`

2. **간단한 설명** (132자 이내):
   ```
   오후 3시 정각 자동 케이터링 예약 시스템. 지정된 시간에 자동으로 예약 폼을 제출합니다.
   ```

3. **상세 설명**:
   ```
   Catering은 특정 시간(오후 3시)에 정확히 케이터링 예약을 자동으로 수행하는 시스템입니다.

   주요 기능:
   - 매일 지정된 시간에 자동 예약 실행
   - 예약 폼 자동 입력
   - 예약 성공/실패 알림
   - 예약 이력 조회
   - 자리 없으면 다음 차수로 자동 재시도

   사용 방법:
   1. 관리 웹사이트(cateringreservationsystem.vercel.app)에서 예약 정보 등록
   2. 익스텐션에서 자동 예약 활성화
   3. 매일 지정된 시간에 자동 실행
   ```

4. **카테고리**: `생산성` 또는 `도구`

5. **언어**: 한국어

6. **스크린샷** (필수, 최소 1개):
   - 크기: 1280x800 또는 640x400
   - 팝업 UI, 대시보드 등의 스크린샷

7. **아이콘**: `public/icons/icon128.png` 사용

8. **개인정보 처리방침 URL** (필수):
   - GitHub Pages 또는 웹사이트에 호스팅
   - 예시: `https://cateringreservationsystem.vercel.app/privacy`

### 5단계: 개인정보 처리방침 페이지 작성

웹사이트에 `/privacy` 페이지를 만들거나, GitHub Pages에 호스팅:

```markdown
# 개인정보 처리방침

## 수집하는 정보
- 예약 정보 (이메일, 이름, 사번, 케이터링 타입)
- 예약 실행 이력

## 정보 사용 목적
- 자동 예약 기능 제공
- 예약 이력 관리

## 정보 저장
- 모든 정보는 사용자의 로컬 Chrome Storage에만 저장됩니다.
- 외부 서버로 전송되지 않습니다.

## 정보 공유
- 제3자와 정보를 공유하지 않습니다.

## 문의
- 이메일: your-email@example.com
```

### 6단계: 심사 제출

1. 모든 필수 항목 작성 완료
2. "제출하여 검토" 클릭
3. 심사 대기 (보통 1-3일)
4. 승인되면 자동으로 Chrome Web Store에 게시됨

---

## 📋 배포 체크리스트

### 빌드 전 확인
- [ ] `manifest.json` 문법 오류 없음
- [ ] 모든 필수 파일 존재
- [ ] 버전 번호 확인 (`manifest.json`의 `version`)

### ZIP 파일 생성 전
- [ ] `pnpm build` 성공
- [ ] `dist/` 폴더에 모든 파일 생성됨
- [ ] `.map` 파일 제외 확인

### Chrome Web Store 제출 전
- [ ] ZIP 파일 생성 완료
- [ ] 스크린샷 준비 (1280x800)
- [ ] 상세 설명 작성
- [ ] 개인정보 처리방침 페이지 작성 및 URL 준비
- [ ] $5 등록비 결제 완료

---

## 🔄 업데이트 방법

1. 코드 수정 후 빌드:
   ```bash
   cd extension
   pnpm build
   ```

2. `manifest.json`의 버전 번호 증가:
   ```json
   "version": "1.0.1"
   ```

3. 새 ZIP 파일 생성:
   ```bash
   ./create-zip.sh
   ```

4. Chrome Web Store에서:
   - "새 버전 업로드" 클릭
   - 새 ZIP 파일 업로드
   - 변경사항 설명 작성
   - 제출 (심사 필요)

---

## 💡 팁

- **스크린샷**: 팝업, 대시보드, 예약 페이지 등의 주요 화면 캡처
- **설명**: 사용자가 이해하기 쉽게 작성
- **개인정보 처리방침**: 반드시 URL 필요 (GitHub Pages 무료 호스팅 가능)

