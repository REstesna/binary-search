const toastContainer = document.getElementById("toast_container");

function showToast(msg) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = msg;
  toastContainer.appendChild(toast);
  setTimeout(() => toast.remove(), 2500);
}

window.addEventListener("DOMContentLoaded", () => {
  if (localStorage.getItem("score")) {
    document.querySelector("#highest_score p:last-child").textContent =
      JSON.parse(localStorage.getItem("score"));
  }
});

let maxGuess, secretNum;

const from = document.getElementById("from");
const to = document.getElementById("to");

const guideReport = document.getElementById("guide_report");

const startGameButton = document.getElementById("game_start_button");

const guessInput = document.querySelector("#playing_area input");
guessInput.disabled = true;

const checkGuessButton = document.querySelector("#check_button");
checkGuessButton.disabled = true;

const resetGame = document.getElementById("reset_button");
resetGame.disabled = true;

const remainGuess = document.getElementById("remain-guess");

function maxGuessHandler(range) {
  maxGuess = Math.floor(Math.log2(range)) + 1;
  remainGuess.textContent = maxGuess;
}

startGameButton.addEventListener("click", () => {
  if (!from.value.trim() || !to.value.trim()) {
    showToast("لطفا اعداد بازه را وارد کنید.");
    return;
  }

  console.log(+from.value, +to.value);

  if (+from.value > +to.value || +from.value === +to.value) {
    showToast("لطفا بازه‌ی اعداد را به درستی در ورودی‌ها وارد بکنید.");
    return;
  }

  showToast("بازی شروع شد");

  secretNum =
    Math.floor(Math.random() * (+to.value - +from.value) + 1) + +from.value;

  maxGuessHandler(+to.value - +from.value + 1);

  guessInput.disabled = false;
  checkGuessButton.disabled = false;
  resetGame.disabled = false;

  startGameButton.disabled = true;

  from.disabled = true;
  to.disabled = true;
});

// resest game handler - set on local storage
resetGame.addEventListener("click", () => {
  console.log("reset game");

  guessInput.disabled = true;
  guessInput.value = "";
  checkGuessButton.disabled = true;

  from.disabled = false;
  to.disabled = false;

  startGameButton.disabled = false;

  from.value = "";
  to.value = "";

  guideReport.textContent = "...";

  document.getElementById("game_report_message").textContent = "عدد را حدس بزن";

  document.getElementById("number_box").style.backgroundColor = "";

  remainGuess.textContent = 0;
});

// chech guess
checkGuessButton.addEventListener("click", () => {
  if (maxGuess === 0) {
    document.getElementById("game_report_message").textContent =
      "متاسفانه امتیازها تمام شد";
    guideReport.textContent = "متاسفانه امتیازها تمام شد";
    document.getElementById("number_box").style.backgroundColor = "red";

    finishGame("LOSE");
    return;
  }

  if (+guessInput.value > +to.value || +guessInput.value < +from.value) {
    showToast("لطفاً یک عدد معتبر حدس بزن.");
    return;
  }

  if (+guessInput.value > +secretNum) {
    guideReport.textContent = "عدد حدس زده شده بزرگ است";
  } else if (+guessInput.value < +secretNum) {
    guideReport.textContent = "عدد حدس زده شده کوچک است";
  }

  if (+guessInput.value === +secretNum) {
    document.getElementById("game_report_message").textContent = "تو بردی";
    guideReport.textContent = "تو بردی";
    document.getElementById("number_box").style.backgroundColor = "green";

    finishGame("WIN");
  }

  console.log(maxGuess, secretNum);

  maxGuess--;

  remainGuess.textContent = maxGuess;
});

/////
function finishGame(status) {
  if (status === "WIN") {
    showToast("بازی را بردید، برای بازی مجدد روی دکمه‌ی بازی مجدد کلیک بکنید");

    const localScore = localStorage.getItem("score")
      ? JSON.parse(localStorage.getItem("score"))
      : -1;

    if (maxGuess > localScore) {
      localStorage.setItem("score", JSON.stringify(maxGuess));
      document.querySelector("#highest_score p:last-child").textContent =
        maxGuess;
    }

    document.querySelector("#current_score p:last-child").textContent =
      maxGuess;
  } else {
    showToast(
      "بازی را باختید، برای بازی مجدد روی دکمه‌ی بازی مجدد کلیک بکنید."
    );
  }

  guessInput.disabled = true;
  checkGuessButton.disabled = true;
  resetGame.disabled = false;
}
