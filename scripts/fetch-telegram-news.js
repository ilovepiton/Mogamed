const fs = require("fs");

const CHANNELS = [
  {
    username: "your_pet_project",
    title: "Your Pet Project",
    category: "AI / Projects"
  },
  {
    username: "serge_ai",
    title: "Serge AI",
    category: "AI News"
  }
];

const OUTPUT_FILE = "data/news.js";
const MAX_NEWS = 20;

function stripHtml(html) {
  return String(html || "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .trim();
}

function cleanText(text) {
  return String(text || "")
    .replace(/\r/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]+/g, " ")
    .split("\n")
    .map((line) => line.trim())
    .join("\n")
    .trim();
}

function makeFingerprint(text) {
  return String(text || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/[^\p{L}\p{N} ]/gu, "")
    .trim()
    .slice(0, 260);
}

function extractFirstLine(text) {
  const lines = String(text || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) {
    return "Telegram update";
  }

  const first = lines[0];

  if (first.length <= 120) {
    return first;
  }

  return first.slice(0, 117) + "...";
}

function extractImage(block) {
  /*
    IMPORTANT:
    Do NOT use generic <img src=""> here.
    Telegram page often contains tiny emoji/sticker images.
    We only want real Telegram post photos.
  */

  const photoWrapMatch = block.match(
    /class="tgme_widget_message_photo_wrap"[\s\S]*?background-image:url\('([^']+)'\)/i
  );

  if (photoWrapMatch && photoWrapMatch[1]) {
    return photoWrapMatch[1].replace(/&amp;/g, "&");
  }

  const photoMatch = block.match(
    /tgme_widget_message_photo[^>]*style="[^"]*background-image:url\('([^']+)'\)/i
  );

  if (photoMatch && photoMatch[1]) {
    return photoMatch[1].replace(/&amp;/g, "&");
  }

  return "";
}

function extractDate(block) {
  const dateMatch = block.match(/<time[^>]+datetime="([^"]+)"/i);

  if (!dateMatch || !dateMatch[1]) {
    return "Today";
  }

  const date = new Date(dateMatch[1]);

  if (Number.isNaN(date.getTime())) {
    return "Today";
  }

  return date.toISOString().slice(0, 10);
}

function extractPostId(block) {
  const postMatch = block.match(/data-post="([^"]+)"/i);

  if (!postMatch || !postMatch[1]) {
    return "";
  }

  return postMatch[1];
}

function extractText(block) {
  const textMatch = block.match(
    /<div class="tgme_widget_message_text[^"]*"[^>]*>([\s\S]*?)<\/div>/i
  );

  if (!textMatch || !textMatch[1]) {
    return "";
  }

  return cleanText(stripHtml(textMatch[1]));
}

function getImportance(text) {
  const lower = String(text || "").toLowerCase();

  const strongWords = [
    "openai",
    "gpt",
    "chatgpt",
    "claude",
    "anthropic",
    "gemini",
    "google",
    "agent",
    "agents",
    "model",
    "release",
    "launch",
    "automation",
    "github",
    "coding",
    "cursor",
    "windsurf",
    "robot",
    "ai",
    "нейро",
    "ии",
    "агент"
  ];

  let score = 3;

  strongWords.forEach((word) => {
    if (lower.includes(word)) {
      score += 0.35;
    }
  });

  if (text.length > 800) {
    score += 0.5;
  }

  return Math.max(3, Math.min(5, Math.round(score)));
}

function splitMessageBlocks(html) {
  const blocks = [];
  const regex =
    /<div class="tgme_widget_message_wrap[\s\S]*?(?=<div class="tgme_widget_message_wrap|<\/section>|<\/body>|$)/g;

  const matches = html.match(regex) || [];

  for (const match of matches) {
    if (match.includes("tgme_widget_message")) {
      blocks.push(match);
    }
  }

  return blocks;
}

async function fetchChannel(channel) {
  const url = `https://t.me/s/${channel.username}`;

  console.log(`Fetching ${url}`);

  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0"
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch ${channel.username}: ${response.status}`);
  }

  const html = await response.text();
  const blocks = splitMessageBlocks(html);

  const news = [];

  for (const block of blocks) {
    const text = extractText(block);

    if (!text) {
      continue;
    }

    const postId = extractPostId(block);
    const link = postId ? `https://t.me/${postId}` : `https://t.me/${channel.username}`;
    const image = extractImage(block);

    news.push({
      title: extractFirstLine(text),
      category: channel.category,
      source: channel.title,
      channel: channel.username,
      date: extractDate(block),
      importance: getImportance(text),
      image,
      summary: text,
      link,
      fingerprint: makeFingerprint(text)
    });
  }

  return news;
}

function makeNewsFile(news) {
  const cleanNews = news.map((item) => {
    const { fingerprint, ...publicItem } = item;
    return publicItem;
  });

  return `window.aiNews = ${JSON.stringify(cleanNews, null, 2)};\n`;
}

async function main() {
  let allNews = [];

  for (const channel of CHANNELS) {
    try {
      const channelNews = await fetchChannel(channel);
      console.log(`Found ${channelNews.length} posts in @${channel.username}`);
      allNews = allNews.concat(channelNews);
    } catch (error) {
      console.error(error.message);
    }
  }

  const seenLinks = new Set();
  const seenTexts = new Set();

  const uniqueNews = allNews
    .filter((item) => {
      const linkKey = item.link || "";
      const textKey = item.fingerprint || makeFingerprint(item.summary);

      if (!textKey) {
        return false;
      }

      if (seenLinks.has(linkKey) || seenTexts.has(textKey)) {
        return false;
      }

      seenLinks.add(linkKey);
      seenTexts.add(textKey);

      return true;
    })
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime() || 0;
      const dateB = new Date(b.date).getTime() || 0;
      return dateB - dateA;
    })
    .slice(0, MAX_NEWS);

  if (!uniqueNews.length) {
    console.log("No news found. Keeping existing data/news.js unchanged.");
    return;
  }

  fs.writeFileSync(OUTPUT_FILE, makeNewsFile(uniqueNews), "utf8");

  console.log(`Saved ${uniqueNews.length} news items to ${OUTPUT_FILE}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
