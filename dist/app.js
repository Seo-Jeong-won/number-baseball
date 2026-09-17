"use strict";

(() => {
  const form = document.getElementById("guess-form");
  const input = document.getElementById("guess-input");
  const submitButton = document.getElementById("submit-button");
  const resetButton = document.getElementById("reset-button");
  const feedback = document.getElementById("feedback");
  const historyBody = document.getElementById("history-body");
  const historyScroll = document.getElementById("history-scroll");
  const emptyHistory = document.getElementById("empty-history");
  const attemptCount = document.getElementById("attempt-count");
  const secretSlots = document.getElementById("secret-slots");
  const roundLabel = document.getElementById("round-label");

  let answer = "";
  let history = [];
  let gameOver = false;

  function showFeedback(message, state = "ready") {
    feedback.textContent = message;
    feedback.dataset.state = state;
  }

  function createBadge(text, className) {
    const badge = document.createElement("span");
    badge.className = `badge ${className}`;
    badge.textContent = text;
    return badge;
  }

  /** for 반복문: 최근 시도부터 기록을 한 줄씩 화면에 표시합니다. */
  function renderHistory() {
    const fragment = document.createDocumentFragment();

    for (let i = history.length - 1; i >= 0; i -= 1) {
      const entry = history[i];
      const row = document.createElement("tr");
      const orderCell = document.createElement("td");
      const guessCell = document.createElement("td");
      const resultCell = document.createElement("td");
      const badges = document.createElement("span");

      orderCell.className = "history-order";
      orderCell.textContent = `${i + 1}회`;
      guessCell.className = "history-guess";
      guessCell.textContent = entry.guess;
      badges.className = "result-badges";

      if (entry.strikes === 0 && entry.balls === 0) {
        badges.append(createBadge("아웃", "out"));
      } else {
        badges.append(createBadge(`${entry.strikes}S`, "strike"));
        badges.append(createBadge(`${entry.balls}B`, "ball"));
      }
      badges.setAttribute("aria-label", `${entry.strikes}스트라이크 ${entry.balls}볼`);
      resultCell.append(badges);
      row.append(orderCell, guessCell, resultCell);
      fragment.append(row);
    }

    historyBody.replaceChildren(fragment);
    emptyHistory.hidden = history.length > 0;
    historyScroll.hidden = history.length === 0;
    attemptCount.textContent = String(history.length);
    historyScroll.scrollTop = 0;
  }

  /** 정답 표시와 숨김도 반복문으로 세 칸에 적용합니다. */
  function renderAnswer(reveal = false) {
    for (let i = 0; i < secretSlots.children.length; i += 1) {
      secretSlots.children[i].textContent = reveal ? answer[i] : "?";
    }
    secretSlots.classList.toggle("is-revealed", reveal);
    secretSlots.setAttribute("aria-label", reveal ? `정답 ${answer}` : "아직 공개되지 않은 세 자리 숫자");
  }

  /** 새 정답을 만들고 이전 게임의 입력, 기록, 종료 상태를 초기화합니다. */
  function resetGame(moveFocus = true) {
    answer = generateAnswer();
    history = [];
    gameOver = false;
    input.value = "";
    input.disabled = false;
    input.removeAttribute("aria-invalid");
    submitButton.disabled = false;
    submitButton.textContent = "확인하기";
    roundLabel.textContent = "도전 중";
    showFeedback("첫 번째 추리를 시작해보세요.");
    renderAnswer();
    renderHistory();
    if (moveFocus) input.focus();
  }

  function handleGuess(event) {
    event.preventDefault();
    if (gameOver) return;

    const guess = input.value.trim();
    const error = validateInput(guess);
    if (error) {
      input.setAttribute("aria-invalid", "true");
      showFeedback(error, "error");
      input.focus();
      return;
    }

    input.removeAttribute("aria-invalid");
    const result = checkGuess(answer, guess);
    history.push({ guess, ...result });
    renderHistory();

    if (result.strikes === 3) {
      gameOver = true;
      input.value = guess;
      input.disabled = true;
      submitButton.disabled = true;
      submitButton.textContent = "정답!";
      roundLabel.textContent = "성공!";
      renderAnswer(true);
      showFeedback(`${history.length}번 만에 성공했어요! 정답은 ${answer}입니다.`, "success");
      resetButton.focus();
    } else {
      const resultText = result.strikes === 0 && result.balls === 0
        ? "아웃! 일치하는 숫자가 없어요."
        : `${result.strikes}스트라이크 ${result.balls}볼! 다음 숫자를 추리해보세요.`;
      showFeedback(`${guess} → ${resultText}`, "result");
      input.value = "";
      input.focus();
    }
  }

  form.addEventListener("submit", handleGuess);
  resetButton.addEventListener("click", () => resetGame());
  input.addEventListener("input", () => {
    if (input.hasAttribute("aria-invalid")) {
      input.removeAttribute("aria-invalid");
      showFeedback("입력을 수정한 뒤 다시 확인해주세요.");
    }
  });
  resetGame(false);
})();
