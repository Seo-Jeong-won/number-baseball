"use strict";

/** while 반복문: 1~9에서 숫자를 하나씩 꺼내 중복 없는 정답을 만듭니다. */
function generateAnswer() {
  const available = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  const answer = [];

  while (answer.length < 3) {
    const index = Math.floor(Math.random() * available.length);
    answer.push(available.splice(index, 1)[0]);
  }

  return answer.join("");
}

/** 입력이 올바르면 빈 문자열, 잘못됐다면 안내 문장을 반환합니다. */
function validateInput(value) {
  if (value.length === 0) {
    return "숫자 3자리를 입력해주세요.";
  }

  // type=number 대신 문자열을 검사하여 소수, 음수, e 표기 등을 거절합니다.
  if (!/^[1-9]{3}$/.test(value)) {
    return "1부터 9까지의 숫자로 세 자리를 입력해주세요. (예: 427)";
  }

  const seen = [];
  for (const digit of value) {
    if (seen.includes(digit)) {
      return "같은 숫자는 한 번만 사용할 수 있어요. 서로 다른 숫자 3개를 입력해주세요.";
    }
    seen.push(digit);
  }

  return "";
}

/** for 반복문: 각 자리를 비교하여 스트라이크와 볼을 계산합니다. */
function checkGuess(answer, guess) {
  let strikes = 0;
  let balls = 0;

  for (let i = 0; i < answer.length; i += 1) {
    if (answer[i] === guess[i]) {
      strikes += 1;
    } else if (answer.includes(guess[i])) {
      balls += 1;
    }
  }

  return { strikes, balls };
}
