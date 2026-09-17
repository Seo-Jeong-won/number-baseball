const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const { test } = require("node:test");

const context = vm.createContext({ Math });
vm.runInContext(fs.readFileSync(path.join(__dirname, "../dist/game.js"), "utf8"), context);
const { generateAnswer, validateInput, checkGuess } = context;

test("정답은 항상 1~9의 중복 없는 세 자리", () => {
  for (let i = 0; i < 500; i += 1) {
    const answer = generateAnswer();
    assert.match(answer, /^[1-9]{3}$/);
    assert.equal(new Set(answer).size, 3);
    assert.equal(validateInput(answer), "");
  }
});

test("빈 입력·문자·소수·음수·중복·잘못된 길이·0·지수 표기 거절", () => {
  const invalid = ["", "abc", "12.3", "-12", "112", "1", "12", "1234", "012", "102", "1e2", "１２３", "4 7", "NaN", "Infinity", " 123 "];
  for (const value of invalid) {
    assert.notEqual(validateInput(value), "", `거절해야 하는 입력: ${value}`);
  }
  assert.equal(validateInput("427"), "");
  assert.equal(validateInput("987"), "");
});

test("정답·1S2B·0S3B·아웃 등 주요 판정", () => {
  const cases = [["427", 3, 0], ["472", 1, 2], ["274", 0, 3], ["123", 1, 0], ["567", 1, 0], ["456", 1, 0], ["789", 0, 1], ["156", 0, 0]];
  for (const [guess, strikes, balls] of cases) {
    const result = checkGuess("427", guess);
    assert.equal(result.strikes, strikes, `${guess} 스트라이크`);
    assert.equal(result.balls, balls, `${guess} 볼`);
  }
});

test("정답 427에 대한 504가지 유효 입력의 판정 일관성", () => {
  for (let value = 123; value <= 987; value += 1) {
    const guess = String(value);
    if (validateInput(guess)) continue;
    const { strikes, balls } = checkGuess("427", guess);
    const expectedStrikes = [...guess].filter((digit, index) => digit === "427"[index]).length;
    const commonDigits = [...new Set(guess)].filter(digit => "427".includes(digit)).length;
    assert.equal(strikes, expectedStrikes);
    assert.equal(strikes + balls, commonDigits);
    assert.ok(strikes + balls <= 3);
  }
});
