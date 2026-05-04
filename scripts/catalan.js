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

function showError(title, textRu) {
  const dailyDate = document.getElementById("dailyDate");
  const dailyWordsGrid = document.getElementById("dailyWordsGrid");

  dailyDate.textContent = title;
  dailyWordsGrid.innerHTML = `
    <article class="daily-word-card">
      <div class="word-type">ERROR</div>
      <h2>${title}</h2>
      <p class="word-translation">${textRu}</p>
      <p class="word-example">Check data/catalan-365.js and scripts/catalan.js</p>
      <p class="word-example-ru">Проверь файл со словами и файл скрипта.</p>
    </article>
  `;
}

function renderCatalanWords() {
  const dailyDate = document.getElementById("dailyDate");
  const dailyWordsGrid = document.getElementById("dailyWordsGrid");

  if (!dailyDate || !dailyWordsGrid) {
    return;
  }

  if (!window.catalan365) {
    showError("Words file is not loaded", "Файл со словами не загрузился.");
    return;
  }

  if (!Array.isArray(window.catalan365)) {
    showError("Wrong words format", "catalan365 должен быть массивом.");
    return;
  }

  const dayNumber = getDayNumber();
  const todayData = window.catalan365.find((item) => Number(item.day) === dayNumber);

  if (!todayData || !Array.isArray(todayData.words)) {
    dailyDate.textContent = `Day ${dayNumber} · No words yet`;
    dailyWordsGrid.innerHTML = `
      <article class="daily-word-card">
        <div class="word-type">EMPTY</div>
        <h2>No words yet</h2>
        <p class="word-translation">Fill day ${dayNumber} in data/catalan-365.js</p>
        <p class="word-example">The system is working, but this day has no words.</p>
        <p class="word-example-ru">Система работает, но для этого дня нет слов.</p>
      </article>
    `;
    return;
  }

  dailyDate.textContent = `Day ${todayData.day} · Today’s Catalan words`;

  dailyWordsGrid.innerHTML = todayData.words
    .map((item) => createWordCard(item))
    .join("");
}

renderCatalanWords();
