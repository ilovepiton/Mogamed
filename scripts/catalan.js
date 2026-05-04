const START_DATE = "2026-05-02";
const QUIZ_STORAGE_KEY = "mogamed_catalan_quiz_memory_v1";
const QUIZ_STATS_KEY = "mogamed_catalan_quiz_stats_v1";

let currentQuizQuestion = null;
let quizLocked = false;

function getDayNumber() {
  const start = new Date(START_DATE + "T00:00:00");
  const today = new Date();

  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffMs = today - start;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  return ((diffDays % 365) + 365) % 365 + 1;
}

function getWordsData() {
  if (window.catalan365 && Array.isArray(window.catalan365)) {
    return window.catalan365;
  }

  if (typeof catalan365 !== "undefined" && Array.isArray(catalan365)) {
    return catalan365;
  }

  return null;
}

function createWordCard(item) {
  const typeClass = item.type === "review" ? "review-word" : "new-word";
  const typeLabel = item.type === "review" ? "REVIEW" : "NEW";

  return `
    <article class="daily-word-card ${typeClass}">
      <div class="word-type">${typeLabel}</div>
      <h2>${item.word || ""}</h2>
      <p class="word-translation">${item.translationEn || ""} / ${item.translationRu || ""}</p>
      <p class="word-example">${item.example || ""}</p>
      <p class="word-example-ru">${item.exampleRu || ""}</p>
    </article>
  `;
}

function showMessage(title, textEn, textRu) {
  const dailyDate = document.getElementById("dailyDate");
  const dailyWordsGrid = document.getElementById("dailyWordsGrid");

  if (!dailyDate || !dailyWordsGrid) {
    return;
  }

  dailyDate.textContent = title;

  dailyWordsGrid.innerHTML = `
    <article class="daily-word-card">
      <div class="word-type">INFO</div>
      <h2>${title}</h2>
      <p class="word-translation">${textEn}</p>
      <p class="word-example-ru">${textRu}</p>
    </article>
  `;
}

function renderCatalanWords() {
  const dailyDate = document.getElementById("dailyDate");
  const dailyWordsGrid = document.getElementById("dailyWordsGrid");

  if (!dailyDate || !dailyWordsGrid) {
    return;
  }

  const wordsData = getWordsData();

  if (!wordsData) {
    showMessage(
      "Words file is not loaded",
      "Check data/catalan-365.js",
      "Файл со словами не загрузился. Проверь, что файл начинается с window.catalan365 = ["
    );
    return;
  }

  const dayNumber = getDayNumber();
  const todayData = wordsData.find((item) => Number(item.day) === dayNumber);

  if (!todayData || !Array.isArray(todayData.words)) {
    showMessage(
      `Day ${dayNumber} · No words yet`,
      `Fill day ${dayNumber} in data/catalan-365.js`,
      `Для дня ${dayNumber} пока нет слов.`
    );
    return;
  }

  dailyDate.textContent = `Day ${todayData.day} · Today’s Catalan words`;

  dailyWordsGrid.innerHTML = todayData.words
    .map((item) => createWordCard(item))
    .join("");
}

function getAvailableWordsForQuiz() {
  const wordsData = getWordsData();
  const dayNumber = getDayNumber();

  if (!wordsData) {
    return [];
  }

  const availableDays = wordsData.filter((dayItem) => {
    return Number(dayItem.day) <= dayNumber && Array.isArray(dayItem.words);
  });

  const words = [];

  availableDays.forEach((dayItem) => {
    dayItem.words.forEach((wordItem, index) => {
      words.push({
        ...wordItem,
        day: dayItem.day,
        id: `${dayItem.day}_${index}_${wordItem.word}`
      });
    });
  });

  return words.filter((item) => item.word && item.translationEn && item.translationRu);
}

function loadQuizMemory() {
  try {
    const saved = localStorage.getItem(QUIZ_STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch (error) {
    return {};
  }
}

function saveQuizMemory(memory) {
  localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(memory));
}

function loadQuizStats() {
  try {
    const saved = localStorage.getItem(QUIZ_STATS_KEY);

    if (saved) {
      return JSON.parse(saved);
    }

    return {
      correct: 0,
      wrong: 0,
      streak: 0
    };
  } catch (error) {
    return {
      correct: 0,
      wrong: 0,
      streak: 0
    };
  }
}

function saveQuizStats(stats) {
  localStorage.setItem(QUIZ_STATS_KEY, JSON.stringify(stats));
}

function renderQuizStats() {
  const stats = loadQuizStats();

  const correctEl = document.getElementById("quizCorrect");
  const wrongEl = document.getElementById("quizWrong");
  const streakEl = document.getElementById("quizStreak");

  if (correctEl) correctEl.textContent = stats.correct || 0;
  if (wrongEl) wrongEl.textContent = stats.wrong || 0;
  if (streakEl) streakEl.textContent = stats.streak || 0;
}

function getWordMemory(wordId) {
  const memory = loadQuizMemory();

  if (!memory[wordId]) {
    memory[wordId] = {
      correct: 0,
      wrong: 0,
      strength: 0,
      nextReviewAt: 0,
      lastAnsweredAt: 0
    };
  }

  return {
    allMemory: memory,
    wordMemory: memory[wordId]
  };
}

function updateWordMemory(wordId, isCorrect) {
  const { allMemory, wordMemory } = getWordMemory(wordId);
  const now = Date.now();

  if (isCorrect) {
    wordMemory.correct += 1;
    wordMemory.strength += 1;

    const delayMinutes = Math.min(
      60 * 24 * 14,
      Math.pow(2, Math.max(0, wordMemory.strength)) * 10
    );

    wordMemory.nextReviewAt = now + delayMinutes * 60 * 1000;
  } else {
    wordMemory.wrong += 1;
    wordMemory.strength = Math.max(-3, wordMemory.strength - 2);
    wordMemory.nextReviewAt = now + 60 * 1000;
  }

  wordMemory.lastAnsweredAt = now;
  allMemory[wordId] = wordMemory;

  saveQuizMemory(allMemory);
}

function updateGlobalStats(isCorrect) {
  const stats = loadQuizStats();

  if (isCorrect) {
    stats.correct = (stats.correct || 0) + 1;
    stats.streak = (stats.streak || 0) + 1;
  } else {
    stats.wrong = (stats.wrong || 0) + 1;
    stats.streak = 0;
  }

  saveQuizStats(stats);
  renderQuizStats();
}

function getQuizWeight(word) {
  const memory = loadQuizMemory();
  const item = memory[word.id];
  const now = Date.now();

  if (!item) {
    return 12;
  }

  let weight = 4;

  if (item.wrong > item.correct) {
    weight += 10;
  }

  if (item.strength < 0) {
    weight += Math.abs(item.strength) * 8;
  }

  if (item.nextReviewAt <= now) {
    weight += 6;
  }

  if (item.strength >= 3 && item.nextReviewAt > now) {
    weight = 1;
  }

  return Math.max(1, weight);
}

function pickWeightedWord(words) {
  const weighted = words.map((word) => ({
    word,
    weight: getQuizWeight(word)
  }));

  const totalWeight = weighted.reduce((sum, item) => sum + item.weight, 0);
  let random = Math.random() * totalWeight;

  for (const item of weighted) {
    random -= item.weight;

    if (random <= 0) {
      return item.word;
    }
  }

  return weighted[0].word;
}

function shuffleArray(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function createOptions(correctWord, allWords, mode) {
  const correctAnswer = mode === "ca-en"
    ? correctWord.translationEn
    : correctWord.word;

  const pool = allWords
    .filter((item) => item.id !== correctWord.id)
    .map((item) => mode === "ca-en" ? item.translationEn : item.word)
    .filter((value) => value && value !== correctAnswer);

  const uniquePool = [...new Set(pool)];
  const wrongOptions = shuffleArray(uniquePool).slice(0, 3);

  return shuffleArray([correctAnswer, ...wrongOptions]);
}

function createQuizQuestion() {
  const allWords = getAvailableWordsForQuiz();

  if (allWords.length < 4) {
    return null;
  }

  const selectedWord = pickWeightedWord(allWords);

  const modes = ["ca-en", "en-ca", "ru-ca"];
  const mode = modes[Math.floor(Math.random() * modes.length)];

  let questionText = "";
  let hintText = "";
  let correctAnswer = "";

  if (mode === "ca-en") {
    questionText = selectedWord.word;
    hintText = "What does this Catalan word mean in English?";
    correctAnswer = selectedWord.translationEn;
  }

  if (mode === "en-ca") {
    questionText = selectedWord.translationEn;
    hintText = "Choose the correct Catalan word.";
    correctAnswer = selectedWord.word;
  }

  if (mode === "ru-ca") {
    questionText = selectedWord.translationRu;
    hintText = "Choose the correct Catalan word.";
    correctAnswer = selectedWord.word;
  }

  return {
    word: selectedWord,
    mode,
    questionText,
    hintText,
    correctAnswer,
    options: createOptions(selectedWord, allWords, mode)
  };
}

function renderQuizQuestion() {
  const quizQuestion = document.getElementById("quizQuestion");
  const quizHint = document.getElementById("quizHint");
  const quizOptions = document.getElementById("quizOptions");
  const quizResult = document.getElementById("quizResult");
  const quizMode = document.getElementById("quizMode");

  if (!quizQuestion || !quizHint || !quizOptions || !quizResult || !quizMode) {
    return;
  }

  currentQuizQuestion = createQuizQuestion();
  quizLocked = false;

  if (!currentQuizQuestion) {
    quizMode.textContent = "QUIZ";
    quizQuestion.textContent = "Not enough words yet";
    quizHint.textContent = "You need at least 4 words in your Catalan list.";
    quizOptions.innerHTML = "";
    quizResult.innerHTML = "";
    return;
  }

  if (currentQuizQuestion.mode === "ca-en") {
    quizMode.textContent = "CATALAN → ENGLISH";
  }

  if (currentQuizQuestion.mode === "en-ca") {
    quizMode.textContent = "ENGLISH → CATALAN";
  }

  if (currentQuizQuestion.mode === "ru-ca") {
    quizMode.textContent = "RUSSIAN → CATALAN";
  }

  quizQuestion.textContent = currentQuizQuestion.questionText;
  quizHint.textContent = currentQuizQuestion.hintText;
  quizResult.innerHTML = "";

  quizOptions.innerHTML = currentQuizQuestion.options
    .map((option) => {
      return `<button class="quiz-option-button" data-answer="${option}">${option}</button>`;
    })
    .join("");

  document.querySelectorAll(".quiz-option-button").forEach((button) => {
    button.addEventListener("click", () => {
      checkQuizAnswer(button);
    });
  });
}

function checkQuizAnswer(button) {
  if (quizLocked || !currentQuizQuestion) {
    return;
  }

  quizLocked = true;

  const selectedAnswer = button.dataset.answer;
  const isCorrect = selectedAnswer === currentQuizQuestion.correctAnswer;

  document.querySelectorAll(".quiz-option-button").forEach((item) => {
    item.disabled = true;

    if (item.dataset.answer === currentQuizQuestion.correctAnswer) {
      item.classList.add("correct");
    }

    if (item === button && !isCorrect) {
      item.classList.add("wrong");
    }
  });

  updateWordMemory(currentQuizQuestion.word.id, isCorrect);
  updateGlobalStats(isCorrect);

  const quizResult = document.getElementById("quizResult");

  if (!quizResult) {
    return;
  }

  if (isCorrect) {
    quizResult.innerHTML = `
      <div class="quiz-result-box good">
        <strong>Correct.</strong>
        <p>${currentQuizQuestion.word.word} — ${currentQuizQuestion.word.translationEn} / ${currentQuizQuestion.word.translationRu}</p>
        <p>${currentQuizQuestion.word.example}</p>
        <p>${currentQuizQuestion.word.exampleRu}</p>
      </div>
    `;
  } else {
    quizResult.innerHTML = `
      <div class="quiz-result-box bad">
        <strong>Wrong. This word will appear again soon.</strong>
        <p>Correct answer: <b>${currentQuizQuestion.correctAnswer}</b></p>
        <p>${currentQuizQuestion.word.word} — ${currentQuizQuestion.word.translationEn} / ${currentQuizQuestion.word.translationRu}</p>
        <p>${currentQuizQuestion.word.example}</p>
        <p>${currentQuizQuestion.word.exampleRu}</p>
      </div>
    `;
  }
}

function resetQuizMemory() {
  localStorage.removeItem(QUIZ_STORAGE_KEY);
  localStorage.removeItem(QUIZ_STATS_KEY);
  renderQuizStats();
  renderQuizQuestion();
}

function setupQuiz() {
  const nextButton = document.getElementById("nextQuizButton");
  const resetButton = document.getElementById("resetQuizButton");

  if (nextButton) {
    nextButton.addEventListener("click", renderQuizQuestion);
  }

  if (resetButton) {
    resetButton.addEventListener("click", resetQuizMemory);
  }

  renderQuizStats();
  renderQuizQuestion();
}

renderCatalanWords();
setupQuiz();
