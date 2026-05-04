* {
  box-sizing: border-box;
}

:root {
  --page-width: 1100px;

  --white: #ffffff;
  --text-soft: rgba(255, 255, 255, 0.9);
  --text-muted: rgba(226, 232, 240, 0.78);

  --glass: rgba(15, 23, 42, 0.58);
  --glass-strong: rgba(15, 23, 42, 0.72);

  --blue: #2563eb;
  --cyan: #22d3ee;
  --pink-soft: #d946ef;
  --purple-soft: #7c3aed;

  --blue-border: rgba(34, 211, 238, 0.24);
  --pink-border: rgba(232, 121, 249, 0.22);
}

/* BASE */

html {
  min-height: 100%;
}

body {
  margin: 0;
  min-height: 100%;
  font-family: Arial, Helvetica, sans-serif;
  color: var(--white);
  background: #0b1020;
  position: relative;
  overflow-x: hidden;
}

body::before {
  content: "";
  position: fixed;
  inset: 0;
  background-image: url("https://images.steamusercontent.com/ugc/1667986149730418478/2413CC1530027A6CE43882C157358AD1E9DCC081/?imw=5000&imh=5000&ima=fit&impolicy=Letterbox&imcolor=%23000000&letterbox=false");
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  filter: blur(8px) saturate(1.25) brightness(1.35);
  transform: scale(1.05);
  opacity: 0.82;
  z-index: -3;
}

body::after {
  content: "";
  position: fixed;
  inset: 0;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0.10), rgba(15, 23, 42, 0.44)),
    radial-gradient(circle at 20% 20%, rgba(34, 211, 238, 0.16), transparent 34%),
    radial-gradient(circle at 82% 24%, rgba(124, 60, 255, 0.12), transparent 34%);
  z-index: -2;
  pointer-events: none;
}

a {
  color: inherit;
}

/* HEADER */

.site-header {
  max-width: var(--page-width);
  margin: 0 auto;
  padding: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 2;
}

.logo {
  color: #ffffff;
  text-decoration: none;
  font-size: 24px;
  font-weight: 900;
  letter-spacing: -0.4px;
  text-shadow: 0 2px 16px rgba(0, 0, 0, 0.65);
}

.logo:hover {
  color: #bae6fd;
}

.main-menu {
  display: flex;
  gap: 18px;
  align-items: center;
}

.main-menu a {
  color: #ffffff;
  text-decoration: none;
  font-size: 14px;
  font-weight: 800;
  text-shadow: 0 2px 14px rgba(0, 0, 0, 0.65);
}

.main-menu a:hover {
  color: #bae6fd;
}

/* GENERAL */

.page {
  max-width: var(--page-width);
  margin: 0 auto;
  padding: 24px;
  position: relative;
  z-index: 1;
}

.hero,
.card,
.daily-info-card,
.daily-word-card,
.quiz-card,
.quiz-progress-card,
.cloud-save-card {
  background:
    radial-gradient(circle at top right, rgba(34, 211, 238, 0.14), transparent 42%),
    linear-gradient(135deg, rgba(15, 23, 42, 0.64), rgba(15, 23, 42, 0.46));
  border: 1px solid var(--blue-border);
  backdrop-filter: blur(18px) saturate(1.15);
  -webkit-backdrop-filter: blur(18px) saturate(1.15);
  box-shadow:
    0 18px 55px rgba(0, 0, 0, 0.24),
    0 0 28px rgba(34, 211, 238, 0.06),
    inset 0 1px 0 rgba(255, 255, 255, 0.10);
}

.hero {
  padding: 34px;
  margin-bottom: 24px;
  border-radius: 24px;
}

.eyebrow,
.card-label,
.ai-news-category {
  margin: 0 0 10px;
  color: #bae6fd;
  font-size: 13px;
  font-weight: 900;
  letter-spacing: 1.2px;
  text-transform: uppercase;
  text-shadow:
    0 0 14px rgba(34, 211, 238, 0.35),
    0 2px 10px rgba(0, 0, 0, 0.45);
}

.hero h1 {
  margin: 0 0 12px;
  color: #ffffff;
  font-size: 42px;
  line-height: 1.08;
  letter-spacing: -1px;
  text-shadow: 0 2px 18px rgba(0, 0, 0, 0.62);
}

.hero p {
  margin: 0;
  color: var(--text-soft);
  font-size: 18px;
  line-height: 1.45;
  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.46);
}

/* BUTTONS */

.card-link,
.quiz-next-button {
  display: inline-block;
  padding: 11px 16px;
  border-radius: 12px;
  border: 1px solid var(--pink-border);
  background: linear-gradient(135deg, var(--pink-soft), var(--purple-soft));
  color: #ffffff;
  text-decoration: none;
  font-weight: 900;
  cursor: pointer;
  box-shadow:
    0 14px 34px rgba(168, 85, 247, 0.26),
    0 0 22px rgba(217, 70, 239, 0.16);
}

.card-link:hover,
.quiz-next-button:hover {
  background: linear-gradient(135deg, #e879f9, #8b5cf6);
}

/* HOME */

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.card {
  padding: 24px;
  border-radius: 22px;
}

.card h2 {
  margin: 0 0 12px;
  color: #ffffff;
  font-size: 24px;
}

.card p {
  color: var(--text-soft);
  line-height: 1.55;
}

.card-link {
  margin-top: 12px;
}

.mission-list {
  padding-left: 20px;
  color: var(--text-soft);
  line-height: 1.7;
}

/* AI NEWS PAGE */

.ai-news-page {
  max-width: 1180px;
}

.news-hero {
  margin-bottom: 30px;
}

.telegram-sources-box {
  margin-top: 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.telegram-sources-box span {
  color: rgba(255, 255, 255, 0.76);
  font-size: 13px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.telegram-sources-list {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.telegram-source-pill {
  display: inline-flex;
  align-items: center;
  padding: 8px 12px;
  border-radius: 999px;
  background: rgba(15, 23, 42, 0.48);
  border: 1px solid rgba(34, 211, 238, 0.28);
  color: #bae6fd;
  text-decoration: none;
  font-size: 13px;
  font-weight: 900;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.18);
}

.telegram-source-pill:hover {
  background: rgba(14, 165, 233, 0.18);
  color: #ffffff;
}

/* MODERN TELEGRAM MAGAZINE NEWS */

.ai-news-feed {
  display: grid;
  grid-template-columns: 1fr;
  gap: 28px;
  background: transparent;
  border: none;
  box-shadow: none;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
  overflow: visible;
}

.news-card-modern {
  overflow: hidden;
  border-radius: 28px;
  background:
    radial-gradient(circle at top right, rgba(34, 211, 238, 0.14), transparent 44%),
    linear-gradient(135deg, rgba(15, 23, 42, 0.68), rgba(15, 23, 42, 0.46));
  border: 1px solid var(--blue-border);
  backdrop-filter: blur(18px) saturate(1.18);
  -webkit-backdrop-filter: blur(18px) saturate(1.18);
  box-shadow:
    0 24px 80px rgba(0, 0, 0, 0.28),
    0 0 34px rgba(34, 211, 238, 0.08),
    inset 0 1px 0 rgba(255, 255, 255, 0.10);
}

.news-image-hero {
  position: relative;
  width: 100%;
  height: 360px;
  overflow: hidden;
  background: rgba(15, 23, 42, 0.72);
}

.news-image-hero img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  transform: scale(1.01);
}

.news-image-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  justify-content: flex-end;
  flex-direction: column;
  padding: 34px;
  background:
    linear-gradient(180deg, rgba(15, 23, 42, 0.04), rgba(15, 23, 42, 0.88)),
    linear-gradient(90deg, rgba(15, 23, 42, 0.82), rgba(15, 23, 42, 0.10));
}

.news-image-overlay h2 {
  max-width: 850px;
  margin: 0;
  color: #ffffff;
  font-size: 46px;
  line-height: 1.02;
  letter-spacing: -1.4px;
  text-shadow:
    0 2px 18px rgba(0, 0, 0, 0.72),
    0 0 22px rgba(34, 211, 238, 0.14);
}

.news-card-body {
  padding: 30px 34px 34px;
}

.news-card-body h2 {
  margin: 0 0 10px;
  color: #ffffff;
  font-size: 42px;
  line-height: 1.05;
  letter-spacing: -1px;
}

.ai-news-meta {
  margin: 0 0 18px;
  color: rgba(226, 232, 240, 0.78);
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
}

.ai-news-summary {
  color: rgba(255, 255, 255, 0.92);
  font-size: 19px;
  line-height: 1.55;
  overflow-wrap: anywhere;
}

.ai-news-summary p {
  margin: 0 0 14px;
}

.ai-news-summary p:last-child {
  margin-bottom: 0;
}

.news-collapsed {
  max-height: 260px;
  overflow: hidden;
  position: relative;
}

.news-collapsed::after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 90px;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(15, 23, 42, 0), rgba(15, 23, 42, 0.92));
}

.news-expanded {
  max-height: none;
  overflow: visible;
}

.news-expanded::after {
  display: none;
}

.news-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-top: 22px;
}

.news-more-button {
  padding: 10px 14px;
  border-radius: 12px;
  border: 1px solid rgba(34, 211, 238, 0.28);
  background: linear-gradient(135deg, var(--blue), #06b6d4);
  color: #ffffff;
  font-size: 14px;
  font-weight: 900;
  cursor: pointer;
  box-shadow:
    0 14px 34px rgba(37, 99, 235, 0.22),
    0 0 20px rgba(34, 211, 238, 0.16);
}

.news-more-button:hover {
  background: linear-gradient(135deg, #1d4ed8, #0891b2);
}

.news-read-link {
  display: inline-flex;
  align-items: center;
  padding: 10px 14px;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--pink-soft), var(--purple-soft));
  color: #ffffff;
  text-decoration: none;
  font-size: 14px;
  font-weight: 900;
  box-shadow:
    0 14px 34px rgba(168, 85, 247, 0.24),
    0 0 22px rgba(217, 70, 239, 0.14);
}

.news-read-link:hover {
  background: linear-gradient(135deg, #e879f9, #8b5cf6);
}

.news-card-modern.no-image-news .news-card-body {
  padding: 36px;
}

/* CATALAN */

.catalan-page {
  max-width: 1180px;
}

.daily-words-top {
  margin-bottom: 24px;
}

.centered-daily-card {
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.daily-info-card {
  width: 100%;
  max-width: 560px;
  padding: 24px;
  border-radius: 22px;
}

.daily-info-card h2 {
  margin: 0 0 10px;
  color: #ffffff;
  font-size: 24px;
}

.daily-info-card p {
  margin: 0;
  color: var(--text-soft);
  line-height: 1.5;
}

.daily-word-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 18px;
}

.daily-word-card {
  padding: 22px;
  border-radius: 20px;
  min-height: 230px;
}

.daily-word-card h2 {
  margin: 14px 0 10px;
  color: #ffffff;
  font-size: 30px;
  line-height: 1.05;
}

.word-type {
  display: inline-block;
  padding: 6px 11px;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--blue), var(--cyan));
  color: #ffffff;
  font-size: 11px;
  font-weight: 900;
  letter-spacing: 0.7px;
  box-shadow:
    0 12px 28px rgba(37, 99, 235, 0.30),
    0 0 22px rgba(34, 211, 238, 0.22);
}

.review-word .word-type {
  background: linear-gradient(135deg, #3b82f6, #06b6d4);
}

.word-translation {
  margin: 0 0 12px;
  color: #7dd3fc;
  font-weight: 900;
  line-height: 1.35;
}

.word-example {
  margin: 0 0 8px;
  color: rgba(255, 255, 255, 0.92);
  line-height: 1.45;
}

.word-example-ru {
  margin: 0;
  color: var(--text-muted);
  line-height: 1.45;
}

/* CLOUD SAVE */

.cloud-save-section {
  margin-bottom: 28px;
}

.cloud-save-card {
  padding: 26px;
  border-radius: 24px;
}

.cloud-save-card h2 {
  margin: 0 0 10px;
  color: #ffffff;
  font-size: 28px;
}

.cloud-save-card p {
  color: rgba(255, 255, 255, 0.86);
  line-height: 1.45;
}

.cloud-save-row {
  display: flex;
  gap: 12px;
  margin-top: 18px;
  flex-wrap: wrap;
}

.cloud-save-input {
  flex: 1;
  min-width: 220px;
  padding: 13px 15px;
  border-radius: 14px;
  border: 1px solid rgba(34, 211, 238, 0.28);
  background: rgba(15, 23, 42, 0.58);
  color: #ffffff;
  font-size: 15px;
  font-weight: 800;
  outline: none;
}

.cloud-save-input::placeholder {
  color: rgba(226, 232, 240, 0.55);
}

.cloud-save-input:focus {
  border-color: rgba(34, 211, 238, 0.7);
  box-shadow: 0 0 0 3px rgba(34, 211, 238, 0.12);
}

.cloud-status {
  margin: 14px 0 0;
  color: #bae6fd !important;
  font-weight: 800;
}

/* QUIZ PROGRESS */

.quiz-progress-section {
  margin-top: 32px;
  margin-bottom: 28px;
}

.quiz-progress-card {
  padding: 26px;
  border-radius: 24px;
}

.quiz-progress-card h2 {
  margin: 0 0 18px;
  color: #ffffff;
  font-size: 30px;
}

.quiz-progress-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}

.quiz-progress-grid div,
.quiz-stats div {
  padding: 16px;
  border-radius: 18px;
  background: rgba(15, 23, 42, 0.52);
  border: 1px solid rgba(34, 211, 238, 0.22);
}

.quiz-progress-grid span,
.quiz-stats span {
  display: block;
  color: #ffffff;
  font-size: 30px;
  font-weight: 900;
}

.quiz-progress-grid p,
.quiz-stats p {
  margin: 6px 0 0;
  color: var(--text-muted);
  font-size: 12px;
  font-weight: 900;
  text-transform: uppercase;
}

.quiz-progress-note {
  margin: 18px 0 0;
  color: rgba(255, 255, 255, 0.78);
  line-height: 1.45;
}

/* QUIZ */

.quiz-section {
  margin-top: 42px;
  padding-top: 30px;
  border-top: 1px solid rgba(34, 211, 238, 0.22);
}

.quiz-header {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 24px;
  align-items: end;
  margin-bottom: 22px;
}

.quiz-header h2 {
  margin: 0 0 10px;
  color: #ffffff;
  font-size: 34px;
}

.quiz-header p {
  margin: 0;
  color: var(--text-soft);
  line-height: 1.5;
}

.quiz-stats {
  display: flex;
  gap: 12px;
}

.quiz-card {
  padding: 26px;
  border-radius: 24px;
}

.quiz-card h2 {
  margin: 10px 0 8px;
  color: #ffffff;
  font-size: 42px;
}

.quiz-hint {
  margin: 0 0 22px;
  color: var(--text-soft);
}

.quiz-options {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
}

.quiz-option-button {
  padding: 16px 18px;
  border: 1px solid rgba(34, 211, 238, 0.24);
  border-radius: 18px;
  background: rgba(15, 23, 42, 0.52);
  color: #ffffff;
  font-size: 17px;
  font-weight: 900;
  cursor: pointer;
  text-align: left;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

.quiz-option-button:hover {
  background: rgba(14, 165, 233, 0.22);
  border-color: rgba(34, 211, 238, 0.60);
}

.quiz-option-button.correct {
  background: rgba(20, 184, 166, 0.38);
  border-color: #14b8a6;
}

.quiz-option-button.wrong {
  background: rgba(239, 68, 68, 0.34);
  border-color: #ef4444;
}

.quiz-result {
  margin-top: 18px;
}

.quiz-result-box {
  padding: 18px;
  border-radius: 18px;
  line-height: 1.45;
}

.quiz-result-box p {
  margin: 8px 0 0;
}

.quiz-result-box.good {
  background: rgba(20, 184, 166, 0.2);
  border: 1px solid rgba(20, 184, 166, 0.55);
}

.quiz-result-box.bad {
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.55);
}

.quiz-actions {
  display: flex;
  gap: 12px;
  margin-top: 18px;
  flex-wrap: wrap;
}

.quiz-reset-button {
  padding: 12px 16px;
  border-radius: 14px;
  background: rgba(15, 23, 42, 0.62);
  border: 1px solid var(--pink-border);
  color: #ffffff;
  font-weight: 900;
  cursor: pointer;
}

.quiz-reset-button:hover {
  background: rgba(34, 211, 238, 0.16);
}

/* LINKS */

.links-page {
  max-width: 1100px;
}

.app-section {
  margin-top: 34px;
}

.app-section h2 {
  margin: 0 0 24px;
  color: #ffffff;
  font-size: 28px;
  text-shadow: 0 2px 16px rgba(0, 0, 0, 0.58);
}

.app-circle-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 34px 30px;
  align-items: start;
}

.circle-app {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  color: #ffffff;
  text-decoration: none;
}

.circle-app-icon {
  width: 104px;
  height: 104px;
  min-width: 104px;
  min-height: 104px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(34, 211, 238, 0.28);
  box-shadow:
    0 18px 42px rgba(0, 0, 0, 0.30),
    0 0 28px rgba(34, 211, 238, 0.10);
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.circle-app:hover .circle-app-icon {
  transform: translateY(-4px) scale(1.04);
  box-shadow:
    0 24px 55px rgba(37, 99, 235, 0.30),
    0 0 34px rgba(34, 211, 238, 0.26);
}

.circle-app span {
  color: #ffffff;
  font-size: 15px;
  font-weight: 900;
  text-align: center;
  max-width: 130px;
  line-height: 1.25;
  text-shadow: 0 2px 14px rgba(0, 0, 0, 0.65);
}

.logo-icon img {
  width: 52px;
  height: 52px;
  max-width: 52px;
  max-height: 52px;
  object-fit: contain;
  display: block;
}

.chatgpt-icon img,
.kings-icon img,
.magic-icon img {
  width: 104px;
  height: 104px;
  max-width: 104px;
  max-height: 104px;
  object-fit: cover;
  display: block;
}

.github-icon img {
  width: 62px;
  height: 62px;
}

.youtube-icon img {
  width: 54px;
  height: 54px;
}

.translate-icon img {
  width: 56px;
  height: 56px;
}

.discord-icon img {
  width: 58px;
  height: 58px;
}

.proton-icon img {
  width: 56px;
  height: 56px;
}

.github-icon {
  background: linear-gradient(135deg, #374151, #111827);
}

.youtube-icon {
  background: linear-gradient(135deg, #ef4444, #991b1b);
}

.translate-icon {
  background: linear-gradient(135deg, #3b82f6, #06b6d4);
}

.discord-icon {
  background: linear-gradient(135deg, #5865f2, #2563eb);
}

.proton-icon {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
}

.kings-icon,
.magic-icon {
  background: #ffffff;
}

/* MOBILE */

@media (max-width: 1100px) {
  .daily-word-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 900px) {
  .app-circle-grid {
    grid-template-columns: repeat(3, 1fr);
  }

  .quiz-header {
    grid-template-columns: 1fr;
  }

  .quiz-stats {
    width: 100%;
  }

  .quiz-stats div {
    flex: 1;
  }

  .quiz-progress-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 800px) {
  .site-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }

  .main-menu {
    flex-wrap: wrap;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .daily-word-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .daily-info-card {
    max-width: 100%;
  }

  .quiz-options {
    grid-template-columns: 1fr;
  }

  .hero h1 {
    font-size: 32px;
  }

  .news-image-hero {
    height: 260px;
  }

  .news-image-overlay {
    padding: 24px;
  }

  .news-image-overlay h2,
  .news-card-body h2 {
    font-size: 32px;
  }

  .news-card-body {
    padding: 24px;
  }

  .ai-news-summary {
    font-size: 17px;
  }
}

@media (max-width: 520px) {
  .app-circle-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .daily-word-grid,
  .quiz-progress-grid {
    grid-template-columns: 1fr;
  }

  .circle-app-icon {
    width: 88px;
    height: 88px;
    min-width: 88px;
    min-height: 88px;
  }

  .logo-icon img {
    width: 38px;
    height: 38px;
  }

  .chatgpt-icon img,
  .kings-icon img,
  .magic-icon img {
    width: 88px;
    height: 88px;
    max-width: 88px;
    max-height: 88px;
  }

  .hero {
    padding: 26px;
  }

  .hero h1 {
    font-size: 30px;
  }
}
