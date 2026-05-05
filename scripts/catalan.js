const DAILY_START_DATE = new Date("2026-05-01T00:00:00");

const QUIZ_STORAGE_KEY = "mogamed_catalan_quiz_memory_v1";
const CLOUD_SECRET_KEY = "mogamed_catalan_cloud_secret_v1";

const SUPABASE_TABLE = "catalan_quiz_progress";

const dailyDate = document.getElementById("dailyDate");
const dailyWordsGrid = document.getElementById("dailyWordsGrid");

const quizMode = document.getElementById("quizMode");
const quizQuestion = document.getElementById("quizQuestion");
const quizHint = document.getElementById("quizHint");
const quizOptions = document.getElementById("quizOptions");
const quizResult = document.getElementById("quizResult");

const quizCorrect = document.getElementById("quizCorrect");
const quizWrong = document.getElementById("quizWrong");
const quizStreak = document.getElementById("quizStreak");

const totalPracticed = document.getElementById("totalPracticed");
const strongWords = document.getElementById("strongWords");
const difficultWords = document.getElementById("difficultWords");
const totalAttempts = document.getElementById("totalAttempts");

const nextQuizButton = document.getElementById("nextQuizButton");
const dontKnowButton = document.getElementById("dontKnowButton");
const resetQuizButton = document.getElementById("resetQuizButton");

const secretCodeInput = document.getElementById("secretCodeInput");
const connectCloudButton = document.getElementById("connectCloudButton");
const cloudStatus = document.getElementById("cloudStatus");

let quizMemory = {};
let quizStats = {
  correct: 0,
  wrong: 0,
  streak: 0
};

let currentQuizWord = null;
let currentQuizAnswer = "";
let currentQuizMode = "ca-en";
let currentQuizAnswered = false;

let supabaseClient = null;
let cloudSecret = localStorage.getItem(CLOUD_SECRET_KEY) || "";

function getAllWords() {
  if (!window.catalan365 || !Array.isArray(window.catalan365)) {
    return [];
  }

  return window.catalan365.flatMap((dayItem) => {
    return dayItem.words.map((wordItem) => {
      return {
        ...wordItem,
        day: dayItem.day,
        id: `${dayItem.day}-${wordItem.word}`
      };
    });
  });
}

function getCurrentDayNumber() {
  const now = new Date();
  const diff = now.getTime() - DAILY_START_DATE.getTime();
  const dayIndex = Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;

  if (dayIndex < 1) {
    return 1;
  }

  if (dayIndex > 365) {
    return ((dayIndex - 1) % 365) + 1;
  }

  return dayIndex;
}

function getTodayData() {
  const dayNumber = getCurrentDayNumber();

  if (!window.catalan365 || !Array.isArray(window.catalan365)) {
    return null;
  }

  return window.catalan365.find((item) => item.day === dayNumber) || window.catalan365[0];
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderDailyWords() {
  const todayData = getTodayData();

  if (!todayData || !dailyWordsGrid) {
    if (dailyDate) {
      dailyDate.textContent = "Words are not loaded";
    }

    return;
  }

  if (dailyDate) {
    dailyDate.textContent = `Day ${todayData.day} · Today’s Catalan words`;
  }

  dailyWordsGrid.innerHTML = todayData.words
    .map((item) => {
      const isReview = item.type === "review";

      return `
        <article class="daily-word-card ${isReview ? "review-word" : "new-word"}">
          <span class="word-type">${isReview ? "Review" : "New"}</span>
          <h2>${escapeHtml(item.word)}</h2>
          <p class="word-translation">${escapeHtml(item.translationEn)} / ${escapeHtml(item.translationRu)}</p>
          <p class="word-example">${escapeHtml(item.example)}</p>
          <p class="word-example-ru">${escapeHtml(item.exampleRu)}</p>
        </article>
      `;
    })
    .join("");
}

function loadQuizMemory() {
  try {
    const saved = localStorage.getItem(QUIZ_STORAGE_KEY);

    if (!saved) {
      return;
    }

    const parsed = JSON.parse(saved);

    quizMemory = parsed.quizMemory || {};
    quizStats = parsed.quizStats || {
      correct: 0,
      wrong: 0,
      streak: 0
    };
  } catch (error) {
    quizMemory = {};
    quizStats = {
      correct: 0,
      wrong: 0,
      streak: 0
    };
  }
}

function saveQuizMemory() {
  const data = {
    quizMemory,
    quizStats,
    updatedAt: new Date().toISOString()
  };

  localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(data));
  saveCloudProgress();
}

function getWordMemory(wordId) {
  if (!quizMemory[wordId]) {
    quizMemory[wordId] = {
      correct: 0,
      wrong: 0,
      seen: 0,
      weight: 3,
      lastSeenAt: null
    };
  }

  return quizMemory[wordId];
}

function updateQuizStats() {
  if (quizCorrect) {
    quizCorrect.textContent = quizStats.correct || 0;
  }

  if (quizWrong) {
    quizWrong.textContent = quizStats.wrong || 0;
  }

  if (quizStreak) {
    quizStreak.textContent = quizStats.streak || 0;
  }
}

function renderQuizProgress() {
  const memoryValues = Object.values(quizMemory);

  const practiced = memoryValues.filter((item) => item.seen > 0).length;
  const strong = memoryValues.filter((item) => item.correct >= 3 && item.wrong === 0).length;
  const difficult = memoryValues.filter((item) => item.wrong > item.correct).length;
  const attempts = memoryValues.reduce((sum, item) => sum + (item.seen || 0), 0);

  if (totalPracticed) {
    totalPracticed.textContent = practiced;
  }

  if (strongWords) {
    strongWords.textContent = strong;
  }

  if (difficultWords) {
    difficultWords.textContent = difficult;
  }

  if (totalAttempts) {
    totalAttempts.textContent = attempts;
  }
}

function weightedRandomWord(words) {
  const weighted = words.map((word) => {
    const memory = getWordMemory(word.id);

    let weight = memory.weight || 3;

    if (memory.wrong > memory.correct) {
      weight += 4;
    }

    if (memory.seen === 0) {
      weight += 2;
    }

    if (memory.correct >= 3 && memory.wrong === 0) {
      weight = Math.max(1, weight - 3);
    }

    return {
      word,
      weight: Math.max(1, weight)
    };
  });

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

function buildQuizOptions(correctWord, mode) {
  const allWords = getAllWords();
  const otherWords = allWords.filter((item) => item.id !== correctWord.id);

  const randomWrong = shuffleArray(otherWords).slice(0, 3);

  const options = [correctWord, ...randomWrong];

  return shuffleArray(options).map((item) => {
    if (mode === "ca-en") {
      return {
        label: item.translationEn,
        value: item.translationEn
      };
    }

    if (mode === "en-ca") {
      return {
        label: item.word,
        value: item.word
      };
    }

    return {
      label: item.translationRu,
      value: item.translationRu
    };
  });
}

function getQuestionText(word, mode) {
  if (mode === "ca-en") {
    return word.word;
  }

  if (mode === "en-ca") {
    return word.translationEn;
  }

  return word.word;
}

function getModeLabel(mode) {
  if (mode === "ca-en") {
    return "Catalan → English";
  }

  if (mode === "en-ca") {
    return "English → Catalan";
  }

  return "Catalan → Russian";
}

function getHintText(mode) {
  if (mode === "ca-en") {
    return "What does this Catalan word mean in English?";
  }

  if (mode === "en-ca") {
    return "Choose the correct Catalan word.";
  }

  return "What does this Catalan word mean in Russian?";
}

function getCorrectAnswer(word, mode) {
  if (mode === "ca-en") {
    return word.translationEn;
  }

  if (mode === "en-ca") {
    return word.word;
  }

  return word.translationRu;
}

function nextQuiz() {
  const words = getAllWords();

  if (!words.length) {
    if (quizQuestion) {
      quizQuestion.textContent = "Quiz is not loaded";
    }

    return;
  }

  currentQuizWord = weightedRandomWord(words);

  const modes = ["ca-en", "en-ca", "ca-ru"];
  currentQuizMode = modes[Math.floor(Math.random() * modes.length)];
  currentQuizAnswer = getCorrectAnswer(currentQuizWord, currentQuizMode);
  currentQuizAnswered = false;

  if (quizMode) {
    quizMode.textContent = getModeLabel(currentQuizMode);
  }

  if (quizQuestion) {
    quizQuestion.textContent = getQuestionText(currentQuizWord, currentQuizMode);
  }

  if (quizHint) {
    quizHint.textContent = getHintText(currentQuizMode);
  }

  if (quizResult) {
    quizResult.innerHTML = "";
  }

  const options = buildQuizOptions(currentQuizWord, currentQuizMode);

  if (quizOptions) {
    quizOptions.innerHTML = options
      .map((option) => {
        return `
          <button class="quiz-option-button" type="button" data-answer="${escapeHtml(option.value)}">
            ${escapeHtml(option.label)}
          </button>
        `;
      })
      .join("");

    document.querySelectorAll(".quiz-option-button").forEach((button) => {
      button.addEventListener("click", () => {
        handleQuizAnswer(button.dataset.answer);
      });
    });
  }
}

function markButtons(selectedAnswer, isCorrect) {
  document.querySelectorAll(".quiz-option-button").forEach((button) => {
    const value = button.dataset.answer;

    button.disabled = true;

    if (value === currentQuizAnswer) {
      button.classList.add("correct");
    }

    if (value === selectedAnswer && !isCorrect) {
      button.classList.add("wrong");
    }
  });
}

function handleQuizAnswer(selectedAnswer) {
  if (!currentQuizWord || currentQuizAnswered) {
    return;
  }

  currentQuizAnswered = true;

  const userDoesNotKnow = selectedAnswer === "__dont_know__";
  const isCorrect = selectedAnswer === currentQuizAnswer && !userDoesNotKnow;

  const memory = getWordMemory(currentQuizWord.id);

  memory.seen += 1;
  memory.lastSeenAt = new Date().toISOString();

  if (isCorrect) {
    memory.correct += 1;
    memory.weight = Math.max(1, (memory.weight || 3) - 1);

    quizStats.correct += 1;
    quizStats.streak += 1;

    if (quizResult) {
      quizResult.innerHTML = `
        <div class="quiz-result-box good">
          <strong>Correct.</strong>
          <p>${escapeHtml(currentQuizWord.word)} = ${escapeHtml(currentQuizWord.translationEn)} / ${escapeHtml(currentQuizWord.translationRu)}</p>
          <p>${escapeHtml(currentQuizWord.example)}</p>
        </div>
      `;
    }
  } else {
    memory.wrong += 1;
    memory.weight = Math.min(10, (memory.weight || 3) + 3);

    quizStats.wrong += 1;
    quizStats.streak = 0;

    if (quizResult) {
      quizResult.innerHTML = `
        <div class="quiz-result-box bad">
          <strong>${userDoesNotKnow ? "No problem. Remember this one." : "Wrong."}</strong>
          <p>Correct answer: ${escapeHtml(currentQuizAnswer)}</p>
          <p>Catalan word: ${escapeHtml(currentQuizWord.word)}</p>
          <p>English: ${escapeHtml(currentQuizWord.translationEn)}</p>
          <p>Russian: ${escapeHtml(currentQuizWord.translationRu)}</p>
          <p>${escapeHtml(currentQuizWord.example)}</p>
        </div>
      `;
    }
  }

  markButtons(selectedAnswer, isCorrect);
  saveQuizMemory();
  updateQuizStats();
  renderQuizProgress();
}

function resetQuizMemory() {
  const confirmed = window.confirm(
    "Are you sure? This will delete your quiz memory."
  );

  if (!confirmed) {
    return;
  }

  localStorage.removeItem(QUIZ_STORAGE_KEY);

  quizMemory = {};
  quizStats = {
    correct: 0,
    wrong: 0,
    streak: 0
  };

  saveQuizMemory();
  updateQuizStats();
  renderQuizProgress();
  nextQuiz();
}

function initSupabase() {
  if (!window.supabase || !window.SUPABASE_URL || !window.SUPABASE_ANON_KEY) {
    if (cloudStatus) {
      cloudStatus.textContent = "Cloud save is not configured yet.";
    }

    return;
  }

  supabaseClient = window.supabase.createClient(
    window.SUPABASE_URL,
    window.SUPABASE_ANON_KEY
  );
}

async function loadCloudProgress() {
  if (!supabaseClient || !cloudSecret) {
    return;
  }

  try {
    if (cloudStatus) {
      cloudStatus.textContent = "Loading cloud progress...";
    }

    const { data, error } = await supabaseClient
      .from(SUPABASE_TABLE)
      .select("*")
      .eq("secret_code", cloudSecret)
      .single();

    if (error && error.code !== "PGRST116") {
      throw error;
    }

    if (data && data.progress) {
      quizMemory = data.progress.quizMemory || {};
      quizStats = data.progress.quizStats || quizStats;

      localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(data.progress));

      updateQuizStats();
      renderQuizProgress();

      if (cloudStatus) {
        cloudStatus.textContent = "Cloud progress loaded.";
      }
    } else {
      if (cloudStatus) {
        cloudStatus.textContent = "Cloud connected. New progress will be saved.";
      }

      await saveCloudProgress();
    }
  } catch (error) {
    if (cloudStatus) {
      cloudStatus.textContent = "Cloud load failed. Local save still works.";
    }
  }
}

async function saveCloudProgress() {
  if (!supabaseClient || !cloudSecret) {
    return;
  }

  const progress = {
    quizMemory,
    quizStats,
    updatedAt: new Date().toISOString()
  };

  try {
    const { error } = await supabaseClient
      .from(SUPABASE_TABLE)
      .upsert(
        {
          secret_code: cloudSecret,
          progress,
          updated_at: new Date().toISOString()
        },
        {
          onConflict: "secret_code"
        }
      );

    if (error) {
      throw error;
    }

    if (cloudStatus) {
      cloudStatus.textContent = "Cloud progress saved.";
    }
  } catch (error) {
    if (cloudStatus) {
      cloudStatus.textContent = "Cloud save failed. Local save still works.";
    }
  }
}

function setupCloudSave() {
  if (secretCodeInput && cloudSecret) {
    secretCodeInput.value = cloudSecret;
  }

  if (connectCloudButton) {
    connectCloudButton.addEventListener("click", async () => {
      const code = secretCodeInput ? secretCodeInput.value.trim() : "";

      if (!code) {
        if (cloudStatus) {
          cloudStatus.textContent = "Enter a secret code first.";
        }

        return;
      }

      cloudSecret = code;
      localStorage.setItem(CLOUD_SECRET_KEY, cloudSecret);

      await loadCloudProgress();
      await saveCloudProgress();
    });
  }
}

if (nextQuizButton) {
  nextQuizButton.addEventListener("click", nextQuiz);
}

if (dontKnowButton) {
  dontKnowButton.addEventListener("click", () => {
    handleQuizAnswer("__dont_know__");
  });
}

if (resetQuizButton) {
  resetQuizButton.addEventListener("click", resetQuizMemory);
}

loadQuizMemory();
renderDailyWords();
updateQuizStats();
renderQuizProgress();
initSupabase();
setupCloudSave();

if (cloudSecret) {
  loadCloudProgress();
}

nextQuiz();
