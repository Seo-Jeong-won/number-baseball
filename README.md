# 숫자 야구 · Number Baseball

함수와 반복문을 활용한 HTML·CSS·JavaScript 숫자 야구 웹앱입니다.
밝은 배경과 코발트 블루를 사용하며, PC와 모바일 화면에 맞춰 배치가 달라집니다.

## 실행

`dist/index.html`을 브라우저로 열면 바로 플레이할 수 있습니다.
별도 패키지 설치, 빌드, API 키, 데이터베이스가 필요하지 않습니다.

## 게임 규칙과 기능

- 컴퓨터는 1~9 중 서로 다른 숫자 3개로 정답을 만듭니다. 0은 사용하지 않습니다.
- 숫자와 위치가 모두 맞으면 스트라이크, 숫자만 맞으면 볼입니다.
- 일치하는 숫자가 없으면 아웃, 3스트라이크면 성공입니다.
- 예: 정답 `427`, 입력 `472` → 1스트라이크 2볼.
- 빈 입력, 문자, 소수, 음수, 0, 중복 숫자, 자릿수 오류를 안내합니다.
- 잘못된 입력은 시도 횟수와 기록에 포함되지 않습니다.
- 올바른 입력 앞뒤의 공백은 자동으로 제거합니다.
- 시도 횟수와 최근 순 기록을 보여주고, 성공하면 정답을 공개합니다.
- 새 게임 버튼으로 새 정답을 만들고 기록을 초기화합니다.
- 시도 횟수 제한은 없습니다. 새로고침하면 새 게임이 시작됩니다.

## 함수와 반복문 활용

| 파일 / 함수 | 역할 | 사용한 반복문 |
| --- | --- | --- |
| `dist/game.js` / `generateAnswer()` | 후보에서 숫자를 꺼내 중복 없는 정답 생성 | `while` |
| `dist/game.js` / `validateInput()` | 입력 형식과 숫자 중복 검사 | `for...of` |
| `dist/game.js` / `checkGuess()` | 각 자리를 비교해 스트라이크·볼 계산 | `for` |
| `dist/app.js` / `renderHistory()` | 최근 시도부터 기록을 표에 표시 | `for` |
| `dist/app.js` / `renderAnswer()` | 정답 세 칸의 숨김·공개 처리 | `for` |
| `dist/app.js` / `resetGame()` | 새 게임 생성과 화면 초기화 | 위 함수 호출 |
| `dist/app.js` / `handleGuess()` | 검증 → 판정 → 기록 → 성공 여부 처리 | 위 함수 호출 |

정답 생성에서 선택한 숫자를 후보 배열에서 제거하므로 같은 숫자가 다시 선택되지 않습니다.
판정에서는 같은 위치를 먼저 확인하고 `else if`로 볼을 검사하여 한 숫자를 중복 계산하지 않습니다.

## 파일 안내

| 경로 | 내용 |
| --- | --- |
| `dist/index.html` | 한국어 게임 화면, 규칙, 입력창, 기록 표 |
| `dist/styles.css` | 밝은 배경, 코발트 블루, 반응형 스타일 |
| `dist/game.js` | 정답 생성, 입력 검증, 판정 함수 |
| `dist/app.js` | 이벤트 처리와 화면 갱신 |
| `tests/game.test.cjs` | 게임 로직 검증 |
| `.gitignore` | 로컬 설정과 임시 파일 제외 |

`dist`는 배포할 완성된 파일이 들어 있는 폴더입니다. 이 프로젝트에서는 직접 작성한 소스이므로 Git에 포함합니다.

## GitHub 저장소와 코드 수정

저장소: [Seo-Jeong-won/number-baseball](https://github.com/Seo-Jeong-won/number-baseball).

내 컴퓨터에서 코드를 수정하려면 저장소를 내려받습니다.

```bash
git clone https://github.com/Seo-Jeong-won/number-baseball.git
cd number-baseball
```

파일을 수정한 다음 변경 내용을 올립니다.

```bash
git add .
git commit -m "Update number baseball game"
git push origin main
```

## Cloudflare Pages 배포

1. Cloudflare에 로그인하고 **Workers & Pages**로 이동합니다.
2. **Create application → Pages → Connect to Git** 또는 **Import an existing Git repository**를 선택합니다.
3. GitHub를 연결하고 `number-baseball` 저장소를 선택합니다.
4. 아래 값을 입력하고 **Save and Deploy**를 누릅니다.

| 설정 | 값 |
| --- | --- |
| Project name | `number-baseball` 또는 사용 가능한 이름 |
| Production branch | `main` |
| Framework preset | `None` |
| Build command | `exit 0` |
| Build output directory | `dist` |
| Root directory | 비워 두기: 저장소 최상위 폴더 |
| Environment variables | 필요 없음 |

배포가 성공하면 Cloudflare가 제공하는 실제 `pages.dev` 주소를 열어 확인합니다.
그 주소와 GitHub 저장소 주소가 과제 제출에 사용할 링크입니다.
연결 후 `main` 브랜치에 새 커밋을 푸시하면 Cloudflare Pages가 다시 배포합니다.
이 문서의 설정은 배포 준비 안내이며, 실제 배포 완료 여부는 Cloudflare 화면에서 확인해야 합니다.

공식 안내: [정적 HTML 배포](https://developers.cloudflare.com/pages/framework-guides/deploy-anything/), [Git 연동](https://developers.cloudflare.com/pages/get-started/git-integration/).

## 확인 방법

Node.js가 설치되어 있다면 저장소 폴더에서 실행합니다.

```bash
node --test tests/game.test.cjs
```

브라우저 확인 예시:

1. `abc`, `12.3`, `112`, `012`, `1234`를 제출해 오류 안내와 시도 횟수 0을 확인합니다.
2. `427`처럼 유효한 숫자를 제출해 결과와 기록, 시도 횟수를 확인합니다.
3. 정답을 맞히면 입력이 잠기고 성공 문구와 실제 정답이 표시되는지 확인합니다.
4. 새 게임 버튼을 누르면 기록, 입력, 시도 횟수가 초기화되는지 확인합니다.
5. 휴대폰 폭에서도 입력창과 버튼, 기록을 사용할 수 있는지 확인합니다.

브라우저에서 정답을 생성하는 학습용 게임이며, 순위 서버나 계정 기능은 사용하지 않습니다.
