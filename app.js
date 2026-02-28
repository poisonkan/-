const words = [
  { hanzi: "你好", pinyin: "nǐ hǎo", english: "Hello" },
  { hanzi: "谢谢", pinyin: "xiè xie", english: "Thank you" },
  { hanzi: "再见", pinyin: "zài jiàn", english: "Goodbye" },
  { hanzi: "请", pinyin: "qǐng", english: "Please" },
  { hanzi: "对不起", pinyin: "duì bu qǐ", english: "Sorry" },
  { hanzi: "我爱你", pinyin: "wǒ ài nǐ", english: "I love you" },
];

let currentIndex = 0;

const hanziEl = document.getElementById("hanzi");
const pinyinEl = document.getElementById("pinyin");
const englishEl = document.getElementById("english");

const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const speakBtn = document.getElementById("speakBtn");

const quizWordEl = document.getElementById("quizWord");
const quizOptionsEl = document.getElementById("quizOptions");
const quizFeedbackEl = document.getElementById("quizFeedback");
const nextQuizBtn = document.getElementById("nextQuizBtn");

function renderWord(index) {
  const item = words[index];
  hanziEl.textContent = item.hanzi;
  pinyinEl.textContent = item.pinyin;
  englishEl.textContent = item.english;
}

function speakCurrentWord() {
  const text = words[currentIndex].hanzi;
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "zh-CN";
  utterance.rate = 0.9;
  speechSynthesis.cancel();
  speechSynthesis.speak(utterance);
}

prevBtn.addEventListener("click", () => {
  currentIndex = (currentIndex - 1 + words.length) % words.length;
  renderWord(currentIndex);
});

nextBtn.addEventListener("click", () => {
  currentIndex = (currentIndex + 1) % words.length;
  renderWord(currentIndex);
});

speakBtn.addEventListener("click", speakCurrentWord);

function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function newQuiz() {
  const answer = words[Math.floor(Math.random() * words.length)];
  quizWordEl.textContent = answer.hanzi;
  quizFeedbackEl.textContent = "";
  quizFeedbackEl.className = "feedback";

  const wrongChoices = shuffle(words.filter((item) => item.english !== answer.english))
    .slice(0, 2)
    .map((item) => item.english);

  const options = shuffle([answer.english, ...wrongChoices]);
  quizOptionsEl.innerHTML = "";

  options.forEach((option) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = option;

    btn.addEventListener("click", () => {
      const buttons = quizOptionsEl.querySelectorAll("button");
      buttons.forEach((b) => (b.disabled = true));

      if (option === answer.english) {
        btn.classList.add("correct");
        quizFeedbackEl.textContent = "答对了！继续加油 🎉";
        quizFeedbackEl.classList.add("success");
      } else {
        btn.classList.add("wrong");
        quizFeedbackEl.textContent = `答错了，正确答案是：${answer.english}`;
        quizFeedbackEl.classList.add("error");
        buttons.forEach((b) => {
          if (b.textContent === answer.english) {
            b.classList.add("correct");
          }
        });
      }
    });

    quizOptionsEl.appendChild(btn);
  });
}

nextQuizBtn.addEventListener("click", newQuiz);

renderWord(currentIndex);
newQuiz();
