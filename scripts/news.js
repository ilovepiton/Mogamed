function getTelegramSources() {
  if (window.telegramSources && Array.isArray(window.telegramSources)) {
    return window.telegramSources;
  }

  return [];
}

function getAiNews() {
  if (window.aiNews && Array.isArray(window.aiNews)) {
    return window.aiNews;
  }

  return [];
}

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatLongText(text) {
  const safeText = escapeHtml(text || "");

  return safeText
    .split("\n")
    .filter((line) => line.trim() !== "")
    .map((line) => `<p>${line}</p>`)
    .join("");
}

function getSourceTitle(username) {
  const sources = getTelegramSources();
  const cleanUsername = String(username || "").replace("@", "");

  const source = sources.find((item) => item.username === cleanUsername);

  if (!source) {
    return "";
  }

  return source.title;
}

function createNewsCard(item) {
  const title = escapeHtml(item.title || "Telegram update");
  const category = escapeHtml(item.category || "AI News");
  const source = escapeHtml(item.source || getSourceTitle(item.channel) || "Telegram");
  const date = escapeHtml(item.date || "");
  const importance = item.importance ? ` · Importance ${escapeHtml(item.importance)}/5` : "";
  const summary = formatLongText(item.summary || "");
  const image = String(item.image || "").trim();
  const link = String(item.link || "").trim();

  const meta = `${source}${date ? " · " + date : ""}${importance}`;

  const textBlock = `
    <div class="ai-news-text">
      <p class="ai-news-category">${category}</p>
      <h2>${title}</h2>
      <p class="ai-news-meta">${meta}</p>
      <div class="ai-news-summary">${summary}</div>
      ${
        link
          ? `<a class="news-read-link" href="${escapeHtml(link)}" target="_blank" rel="noopener noreferrer">Open Telegram post</a>`
          : ""
      }
    </div>
  `;

  if (!image) {
    return `
      <article class="ai-news-row no-image-news">
        ${textBlock}
      </article>
    `;
  }

  return `
    <article class="ai-news-row">
      <div class="ai-news-photo">
        <img src="${escapeHtml(image)}" alt="${title}">
      </div>
      ${textBlock}
    </article>
  `;
}

function renderNewsSources() {
  const sourcesList = document.getElementById("telegramSourcesList");

  if (!sourcesList) {
    return;
  }

  const sources = getTelegramSources().filter((item) => item.enabled);

  sourcesList.innerHTML = sources
    .map((source) => {
      return `
        <a class="telegram-source-pill" href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">
          @${escapeHtml(source.username)}
        </a>
      `;
    })
    .join("");
}

function renderAiNews() {
  const newsFeed = document.getElementById("aiNewsFeed");

  if (!newsFeed) {
    return;
  }

  const news = getAiNews();

  if (!news.length) {
    newsFeed.innerHTML = `
      <article class="ai-news-row no-image-news">
        <div class="ai-news-text">
          <p class="ai-news-category">No News</p>
          <h2>No AI news yet</h2>
          <p class="ai-news-meta">System · Waiting</p>
          <div class="ai-news-summary">
            <p>Add news to data/news.js and they will appear here.</p>
          </div>
        </div>
      </article>
    `;
    return;
  }

  newsFeed.innerHTML = news.map((item) => createNewsCard(item)).join("");
}

renderNewsSources();
renderAiNews();
