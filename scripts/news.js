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

  return source ? source.title : "";
}

function createNewsCard(item, index) {
  const title = escapeHtml(item.title || "Telegram update");
  const category = escapeHtml(item.category || "AI News");
  const source = escapeHtml(item.source || getSourceTitle(item.channel) || "Telegram");
  const date = escapeHtml(item.date || "");
  const importance = item.importance ? ` · Importance ${escapeHtml(item.importance)}/5` : "";
  const summary = formatLongText(item.summary || "");
  const image = String(item.image || "").trim();
  const link = String(item.link || "").trim();

  const meta = `${source}${date ? " · " + date : ""}${importance}`;

  const readLink = link
    ? `<a class="news-read-link" href="${escapeHtml(link)}" target="_blank" rel="noopener noreferrer">Open Telegram post</a>`
    : "";

  const readMoreButton = `
    <button class="news-more-button" type="button" data-news-more="${index}">
      Read more
    </button>
  `;

  if (!image) {
    return `
      <article class="news-card-modern no-image-news">
        <div class="news-card-body">
          <p class="ai-news-category">${category}</p>
          <h2>${title}</h2>
          <p class="ai-news-meta">${meta}</p>

          <div class="ai-news-summary news-collapsed" id="newsText${index}">
            ${summary}
          </div>

          <div class="news-actions">
            ${readMoreButton}
            ${readLink}
          </div>
        </div>
      </article>
    `;
  }

  return `
    <article class="news-card-modern">
      <div class="news-image-hero">
        <img src="${escapeHtml(image)}" alt="${title}">
        <div class="news-image-overlay">
          <p class="ai-news-category">${category}</p>
          <h2>${title}</h2>
        </div>
      </div>

      <div class="news-card-body">
        <p class="ai-news-meta">${meta}</p>

        <div class="ai-news-summary news-collapsed" id="newsText${index}">
          ${summary}
        </div>

        <div class="news-actions">
          ${readMoreButton}
          ${readLink}
        </div>
      </div>
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

function setupReadMoreButtons() {
  document.querySelectorAll("[data-news-more]").forEach((button) => {
    button.addEventListener("click", () => {
      const index = button.dataset.newsMore;
      const text = document.getElementById(`newsText${index}`);

      if (!text) {
        return;
      }

      const isOpen = text.classList.toggle("news-expanded");

      text.classList.toggle("news-collapsed", !isOpen);
      button.textContent = isOpen ? "Show less" : "Read more";
    });
  });
}

function renderAiNews() {
  const newsFeed = document.getElementById("aiNewsFeed");

  if (!newsFeed) {
    return;
  }

  const news = getAiNews();

  if (!news.length) {
    newsFeed.innerHTML = `
      <article class="news-card-modern no-image-news">
        <div class="news-card-body">
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

  newsFeed.innerHTML = news.map((item, index) => createNewsCard(item, index)).join("");
  setupReadMoreButtons();
}

renderNewsSources();
renderAiNews();
