# 크롬 익스텐션 배포 가이드

## 방법 1: 로컬 개발자 모드로 설치 (무료, 즉시 사용 가능)

### 장점

- ✅ 완전 무료
- ✅ 즉시 테스트 가능
- ✅ 코드 수정 후 바로 반영 가능

### 단점

- ❌ Chrome 재시작 시 경고 메시지 표시
- ❌ 다른 사람과 공유 불가

### 설치 방법

1. **익스텐션 빌드**

   ```bash
   cd extension
   pnpm build
   ```

2. **Chrome에 로드**

   - Chrome 브라우저 열기
   - 주소창에 `chrome://extensions/` 입력
   - 우측 상단 **"개발자 모드"** 활성화
   - **"압축해제된 확장 프로그램을 로드합니다"** 클릭
   - `extension` 폴더 선택 (루트 폴더)

3. **완료!**
   - 익스텐션이 목록에 나타남
   - 아이콘 클릭하여 사용

### 업데이트 방법

코드를 수정한 후:

```bash
cd extension
pnpm build
```

그 다음 `chrome://extensions/`에서 익스텐션의 **새로고침 버튼** 클릭

---

## 방법 2: Chrome Web Store에 배포 (공식 배포)

### 장점

- ✅ 공식 배포, 경고 없음
- ✅ 다른 사람과 공유 가능
- ✅ 자동 업데이트 지원
- ✅ Chrome Web Store에서 검색 가능

### 단점

- ❌ $5 등록비 (일회성)
- ❌ 심사 과정 필요 (보통 1-3일)
- ❌ 추가 자료 필요 (스크린샷, 설명 등)

### 배포 준비 사항

#### 1. 필수 파일 확인

```
extension/
├── manifest.json          ✅ 필수
├── dist/
│   ├── background.js     ✅ 필수
│   └── content.js        ✅ 필수
├── src/popup/
│   ├── popup.html        ✅ 필수
│   └── popup.js          ✅ 필수
└── public/icons/
    ├── icon16.png        ✅ 필수
    ├── icon48.png        ✅ 필수
    └── icon128.png       ✅ 필수
```

#### 2. ZIP 파일 생성

```bash
cd extension

# 배포용 ZIP 생성 (소스 파일 제외)
zip -r catering-extension.zip \
  manifest.json \
  dist/ \
  src/popup/ \
  public/icons/ \
  -x "*.map" "*.ts" "node_modules/*" ".git/*"
```

또는 수동으로:

1. `extension` 폴더에서 다음 파일/폴더만 선택:
   - `manifest.json`
   - `dist/` 폴더 (`.map` 파일 제외 가능)
   - `src/popup/` 폴더
   - `public/icons/` 폴더
2. ZIP으로 압축

#### 3. Chrome Web Store 개발자 등록

1. **Chrome Web Store 개발자 계정 생성**

   - https://chrome.google.com/webstore/devconsole 접속
   - Google 계정으로 로그인
   - **$5 등록비 결제** (일회성, 평생 유효)

2. **새 항목 추가**
   - "새 항목" 클릭
   - ZIP 파일 업로드

#### 4. 스토어 등록 정보 작성

**필수 항목:**

1. **이름**: `Catering Auto Reservation` (또는 원하는 이름)

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

   사용 방법:
   1. 관리 웹사이트에서 예약 정보 등록
   2. 익스텐션에서 자동 예약 활성화
   3. 매일 지정된 시간에 자동 실행
   ```

4. **카테고리**: `생산성` 또는 `도구`

5. **언어**: 한국어

6. **스크린샷** (필수):

   - 최소 1개, 최대 5개
   - 크기: 1280x800 또는 640x400
   - 팝업 UI, 대시보드 등의 스크린샷

7. **아이콘** (128x128):

   - `public/icons/icon128.png` 사용

8. **개인정보 처리방침** (필수):
   - URL 필요 (예: GitHub Pages 또는 웹사이트)
   - 예시: `https://your-website.com/privacy-policy`

#### 5. 개인정보 처리방침 페이지 작성

간단한 예시:

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

이 내용을 GitHub Pages나 웹사이트에 호스팅하고 URL을 제공해야 합니다.

#### 6. 심사 제출

1. 모든 필수 항목 작성 완료
2. "제출하여 검토" 클릭
3. 심사 대기 (보통 1-3일)
4. 승인되면 자동으로 Chrome Web Store에 게시됨

---

## 방법 3: .crx 파일로 배포 (비공식, 제한적)

### 장점

- ✅ 무료
- ✅ 다른 사람과 공유 가능

### 단점

- ❌ Chrome이 점점 더 제한적으로 만듦
- ❌ 사용자가 개발자 모드를 켜야 함
- ❌ 자동 업데이트 불가

### 생성 방법

1. **개발자 모드로 익스텐션 로드**
2. **"압축하여 확장 프로그램 저장"** 클릭
3. `.crx` 파일 생성됨
4. 다른 사람에게 배포 (사용자는 개발자 모드 필요)

---

## 추천 방법

### 개발/테스트 단계

→ **방법 1: 로컬 개발자 모드** 사용

### 실제 사용/배포

→ **방법 2: Chrome Web Store** 배포 (추천)

---

## 배포 체크리스트

### 필수 항목

- [ ] `manifest.json` 문법 오류 없음
- [ ] 모든 필수 파일 존재 (background.js, content.js 등)
- [ ] 아이콘 파일 존재 (16, 48, 128px)
- [ ] 빌드 성공 확인
- [ ] 로컬 테스트 완료

### Chrome Web Store 배포 시

- [ ] ZIP 파일 생성
- [ ] 스크린샷 준비 (1280x800)
- [ ] 상세 설명 작성
- [ ] 개인정보 처리방침 페이지 작성
- [ ] $5 등록비 결제
- [ ] 스토어 정보 입력
- [ ] 심사 제출

---

## 문제 해결

### ZIP 파일이 너무 큼

- `.map` 파일 제외
- `node_modules` 제외 확인
- 소스 파일(`.ts`) 제외

### 심사 거부 시

- 개인정보 처리방침 확인
- 설명이 충분한지 확인
- 스크린샷이 명확한지 확인

### 업데이트 방법

1. 코드 수정 후 빌드
2. 새 ZIP 파일 생성
3. Chrome Web Store에서 "새 버전 업로드"
4. 변경사항 설명 작성
5. 제출 (심사 필요)

---

## 참고 자료

- [Chrome Web Store 개발자 문서](https://developer.chrome.com/docs/webstore/)
- [Manifest V3 가이드](https://developer.chrome.com/docs/extensions/mv3/)
- [개인정보 처리방침 템플릿](https://www.privacypolicygenerator.info/)
