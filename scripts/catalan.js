const START_DATE = "2026-05-02";

function getDayNumber() {
  const start = new Date(START_DATE + "T00:00:00");
  const today = new Date();

  start.setHours(0, 0, 0, 0);
  today.setHours(0, 0, 0, 0);

  const diffMs = today - start;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  const dayNumber = ((diffDays % 365) + 365) % 365 + 1;

  return dayNumber;
}

function findTodayWords() {
  const dayNumber = getDayNumber();

  const todayData = catalan365.find((item) => item.day === dayNumber);

  if (!todayData) {
    return {
      day: dayNumber,
      words: []
    };
  }

  return todayData;
}

function renderWords() {
  const dailyDate = document.getElementById("dailyDate");
  const dailyWordsGrid = document.getElementById("dailyWordsGrid");

  if (!dailyDate || !dailyWordsGrid) {
    return;
  }

  const todayData = findTodayWords();

  dailyDate.textContent = `Day ${todayData.day} · Today’s Catalan words`;

  if (!todayData.words || todayData.words.length === 0) {
    dailyWordsGrid.innerHTML = `
      <article class="daily-word-card">
        <div class="word-type">EMPTY</div>
        <h2>No words yet</h2>
        <p class="word-translation">Fill this day in data/catalan-365.js</p>
        <p class="word-example">The page is working, but this day has no words.</p>
      </article>
    `;
    return;
  }

  dailyWordsGrid.innerHTML = todayData.words
    .map((item) => {
      const typeClass = item.type === "review" ? "review-word" : "new-word";
      const typeLabel = item.type === "review" ? "REVIEW" : "NEW";

      return `
        <article class="daily-word-card ${typeClass}">
          <div class="word-type">${typeLabel}</div>
          <h2>${item.word}</h2>
          <p class="word-translation">${item.translationEn} / ${item.translationRu}</p>
          <p class="word-example">${item.example}</p>
          <p class="word-example-ru">${item.exampleRu}</p>
        </article>
      `;
    })
    .join("");
}

renderWords();
