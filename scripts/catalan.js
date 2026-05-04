const START_DATE = "2026-05-02";

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

renderCatalanWords();
