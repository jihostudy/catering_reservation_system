# Git 워크플로우 가이드

## 기본 푸시 방법

### 1. 변경사항 확인

```bash
git status
```

- 변경된 파일 목록 확인
- 새로 추가된 파일 확인

### 2. 변경사항 스테이징 (추가)

```bash
# 모든 변경사항 추가
git add .

# 특정 파일만 추가
git add 파일경로

# 특정 폴더만 추가
git add extension/
git add web/
```

### 3. 커밋 생성

```bash
git commit -m "커밋 메시지"
```

**좋은 커밋 메시지 예시:**

```bash
git commit -m "feat: 실제 HTML 구조에 맞게 폼 선택자 수정"
git commit -m "fix: 케이터링 타입 값 매핑 추가"
git commit -m "docs: 테스트 가이드 추가"
git commit -m "refactor: 코드 포맷팅 개선"
```

### 4. 원격 저장소에 푸시

```bash
git push
```

또는 처음 푸시할 때:

```bash
git push -u origin main
```

## 전체 워크플로우 예시

```bash
# 1. 현재 상태 확인
git status

# 2. 모든 변경사항 추가
git add .

# 3. 커밋
git commit -m "설명: 변경 내용"

# 4. 푸시
git push
```

## 자주 사용하는 명령어

### 변경사항 확인

```bash
# 간단한 상태 확인
git status

# 변경된 내용 확인
git diff

# 커밋 히스토리 확인
git log --oneline
```

### 되돌리기

```bash
# 스테이징 취소 (파일은 유지)
git restore --staged 파일명

# 파일 변경사항 취소 (주의: 변경사항 삭제됨)
git restore 파일명

# 마지막 커밋 취소 (커밋만 취소, 변경사항은 유지)
git reset --soft HEAD~1
```

### 브랜치 관리

```bash
# 현재 브랜치 확인
git branch

# 새 브랜치 생성
git checkout -b 브랜치명

# 브랜치 전환
git checkout 브랜치명
```

## 실전 예시

### 시나리오 1: 익스텐션 코드 수정 후 푸시

```bash
# extension/src/content.ts 수정 후

git add extension/src/content.ts
git commit -m "fix: 제출 버튼 찾기 로직 개선"
git push
```

### 시나리오 2: 여러 파일 수정 후 푸시

```bash
# 여러 파일 수정 후

git add .
git commit -m "feat: 웹 대시보드 케이터링 타입 옵션 업데이트"
git push
```

### 시나리오 3: 새 파일 추가 후 푸시

```bash
# 새 문서 파일 추가 후

git add _AI_docs/NEW_DOC.md
git commit -m "docs: 새 문서 추가"
git push
```

## 주의사항

### .gitignore 확인

다음 파일들은 자동으로 제외됩니다:

- `node_modules/`
- `dist/`
- `.env*.local`
- 빌드 결과물

### 커밋 전 확인

```bash
# 커밋 전에 무엇이 추가되는지 확인
git status
git diff --staged
```

### 충돌 해결

원격 저장소에 다른 변경사항이 있을 때:

```bash
# 먼저 pull
git pull

# 충돌 해결 후
git add .
git commit -m "merge: 충돌 해결"
git push
```

## 빠른 참조

| 작업               | 명령어                   |
| ------------------ | ------------------------ |
| 상태 확인          | `git status`             |
| 모든 변경사항 추가 | `git add .`              |
| 커밋               | `git commit -m "메시지"` |
| 푸시               | `git push`               |
| 풀 (가져오기)      | `git pull`               |
| 히스토리 확인      | `git log --oneline`      |
