let state = {
  view: "home",
  rMode: "list",
  rQuizType: "meaning",
  level: "hsk1",
  lessonId: null,
  mode: "list",
  fcIndex: 0,
  fcFlipped: false,
  fcShuffled: [],
  quizIndex: 0,
  quizScore: 0,
  quizAnswered: false,
  quizDone: false,
  quizQuestions: [],
};
function getLessons() {
  return state.level === "hsk1"
    ? HSK1
    : state.level === "hsk2"
      ? HSK2
      : state.level === "hsk3"
        ? HSK3
        : state.level === "hsk4"
          ? HSK4
          : HSK2;
}
function getQuizPool() {
  if (state.level === "hsk4") return HSK4_ALL;
  return getAllWords();
}
function getAllWords() {
  return [...HSK1, ...HSK2, ...HSK3].flatMap((l) => l.words);
}
function shuffle(a) {
  const b = [...a];
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}
function getTotal(arr) {
  return arr.reduce((s, l) => s + l.words.length, 0);
}

function render() {
  const app = document.getElementById("app");
  app.innerHTML =
    renderHeader() +
    renderNav() +
    '<div class="main">' +
    (state.view === "home"
      ? renderHome()
      : state.view === "level"
        ? renderLevel()
        : state.view === "review"
          ? renderReview()
          : state.view === "review2"
            ? renderReview2()
            : state.view === "hsk79set"
              ? renderHSK79Set()
              : state.view === "review3"
                ? renderReview3()
                : state.view === "review4"
                  ? renderReview4()
                  : state.view === "hsk456set"
                  ? renderHSK456Set()
                  : state.view === "grammarAdv"
                    ? renderGrammarAdv()
                    : state.view === "grammar"
                      ? renderGrammar()
                      : renderLesson()) +
    "</div>";
  attachEvents();
}

function renderHeader() {
  return '<div class="header"><div class="header-inner"><div class="logo"><div class="logo-icon">每</div><div><div class="logo-text">Meiday Chinese</div><div class="logo-sub">每日中文 — Học mỗi ngày</div></div></div><div class="header-badge">HSK 3.0</div></div></div>';
}

function renderNav() {
  let b =
    '<button class="nav-btn ' +
    (state.view === "home" ? "active" : "") +
    '" data-nav="home">Trang chủ</button>';
  b +=
    '<button class="nav-btn ' +
    (state.view === "level" && state.level === "hsk1" ? "active" : "") +
    '" data-nav="level" data-lv="hsk1">HSK 1</button>';
  b +=
    '<button class="nav-btn ' +
    (state.view === "level" && state.level === "hsk2" ? "active" : "") +
    '" data-nav="level" data-lv="hsk2">HSK 2</button>';
  b +=
    '<button class="nav-btn ' +
    ((state.view === "level" && state.level === "hsk3") ||
    (state.view === "lesson" && state.level === "hsk3")
      ? "active"
      : "") +
    '" data-nav="level" data-lv="hsk3">HSK 3</button>';
  b +=
    '<button class="nav-btn ' +
    ((state.view === "level" && state.level === "hsk4") ||
    (state.view === "lesson" && state.level === "hsk4") ||
    state.view === "review4"
      ? "active"
      : "") +
    '" data-nav="level" data-lv="hsk4">HSK 4</button>';
  b +=
    '<button class="nav-btn ' +
    ((state.view === "level" && state.level === "hsk5") ||
    (state.view === "hsk456set" && state.level === "hsk5")
      ? "active"
      : "") +
    '" data-nav="level" data-lv="hsk5">HSK 5</button>';
  b +=
    '<button class="nav-btn ' +
    ((state.view === "level" && state.level === "hsk6") ||
    (state.view === "hsk456set" && state.level === "hsk6")
      ? "active"
      : "") +
    '" data-nav="level" data-lv="hsk6">HSK 6</button>';
  b +=
    '<button class="nav-btn ' +
    ((state.view === "level" && state.level === "hsk79") ||
    state.view === "hsk79set"
      ? "active"
      : "") +
    '" data-nav="level" data-lv="hsk79">HSK 7-9</button>';
  return '<div class="nav"><div class="nav-inner">' + b + "</div></div>";
}

function renderHome() {
  const hsk1Total = getTotal(HSK1),
    hsk2Total = getTotal(HSK2);
  let reviewCardHome =
    '<div class="lesson-card review-card" data-action="open-review"><div class="lesson-num" style="color:var(--gold)">⭐ Tổng ôn từ vựng</div><div class="lesson-title-cn">300 từ HSK1</div><div class="lesson-title-vi">Flashcard · Trắc nghiệm · Điền từ</div><div class="lesson-meta"><span class="lesson-tag" style="background:#FFF8E0;color:#B8860B">300 từ</span></div></div>';
  let cards1 = HSK1.map(
    (l) =>
      '<div class="lesson-card" data-lesson="' +
      l.id +
      '" data-lv="hsk1"><div class="lesson-num">第' +
      l.id +
      "课 · Bài " +
      l.id +
      '</div><div class="lesson-title-cn">' +
      l.title +
      '</div><div class="lesson-title-vi">' +
      l.titleVi +
      '</div><div class="lesson-meta"><span class="lesson-tag">' +
      l.words.length +
      " từ</span></div></div>",
  ).join("");
  let reviewCardHome2 =
    '<div class="lesson-card review-card hsk2" data-action="open-review2"><div class="lesson-num" style="color:var(--gold)">⭐ Tổng ôn từ vựng</div><div class="lesson-title-cn">200 từ HSK2</div><div class="lesson-title-vi">Flashcard · Trắc nghiệm · Điền từ</div><div class="lesson-meta"><span class="lesson-tag" style="background:#FFF8E0;color:#B8860B">200 từ</span></div></div>';
  let cards2 = HSK2.map(
    (l) =>
      '<div class="lesson-card hsk2" data-lesson="' +
      l.id +
      '" data-lv="hsk2"><div class="lesson-num">第' +
      l.id +
      "课 · Bài " +
      l.id +
      '</div><div class="lesson-title-cn">' +
      l.title +
      '</div><div class="lesson-title-vi">' +
      l.titleVi +
      '</div><div class="lesson-meta"><span class="lesson-tag">' +
      l.words.length +
      " từ</span></div></div>",
  ).join("");
  let gc1 =
    '<div class="lesson-card" style="border:2px dashed #C0392B;background:linear-gradient(135deg,#FFF8F0,#FFF0E8);cursor:pointer" data-action="open-grammar" data-glv="hsk1"><div class="lesson-num" style="color:#C0392B">📖 Ngữ pháp HSK 1</div><div class="lesson-title-cn" style="font-size:18px">' +
    Object.values(GRAMMAR_HSK1).flat().length +
    ' điểm ngữ pháp</div><div class="lesson-title-vi">Lý thuyết + Ví dụ theo bài</div></div>';
  let gc2 =
    '<div class="lesson-card" style="border:2px dashed #E67E22;background:linear-gradient(135deg,#FFF8F0,#FFF3E8);cursor:pointer" data-action="open-grammar" data-glv="hsk2"><div class="lesson-num" style="color:#E67E22">📖 Ngữ pháp HSK 2</div><div class="lesson-title-cn" style="font-size:18px">' +
    Object.values(GRAMMAR_HSK2).flat().length +
    ' điểm ngữ pháp</div><div class="lesson-title-vi">Lý thuyết + Ví dụ theo bài</div></div>';
  return (
    '<div class="home-hero fade-in"><h1>新HSK教程</h1><p>Ôn tập từ vựng HSK 3.0 theo giáo trình chính thức. Lật thẻ, làm quiz, học mỗi ngày!</p><div class="stats-row"><div class="stat"><div class="stat-num">9</div><div class="stat-label">Cấp độ</div></div><div class="stat"><div class="stat-num">11000</div><div class="stat-label">Từ vựng</div></div><div class="stat"><div class="stat-num">4</div><div class="stat-label">Chế độ ôn</div></div></div></div><div class="section-title"><span class="badge badge-hsk1">HSK 1</span> 新HSK教程 1 <span style="font-size:13px;color:var(--ink-light);font-family:Be Vietnam Pro;font-weight:400">· ' +
    hsk1Total +
    ' từ</span></div><div class="lesson-grid fade-in">' +
    reviewCardHome +
    gc1 +
    cards1 +
    '</div><div class="section-title"><span class="badge badge-hsk2">HSK 2</span> 新HSK教程 2 <span style="font-size:13px;color:var(--ink-light);font-family:Be Vietnam Pro;font-weight:400">· ' +
    hsk2Total +
    ' từ</span></div><div class="lesson-grid fade-in">' +
    reviewCardHome2 +
    gc2 +
    cards2 +
    "</div>" +
    renderHomeHSK3() +
    renderHomeHSK4() +
    renderHomeHSK456() +
    renderHomeHSK79()
  );
}

function renderHomeHSK3() {
  let gc3 =
    '<div class="lesson-card" style="border:2px dashed #27AE60;background:linear-gradient(135deg,#F0FFF8,#E8FFF0);cursor:pointer" data-action="open-grammar" data-glv="hsk3"><div class="lesson-num" style="color:#27AE60">📖 Ngữ pháp HSK 3</div><div class="lesson-title-cn" style="font-size:18px">' +
    Object.values(GRAMMAR_HSK3).flat().length +
    ' điểm ngữ pháp</div><div class="lesson-title-vi">Lý thuyết + Ví dụ theo bài</div></div>';
  let rc3 =
    '<div class="lesson-card review-card hsk3" data-action="open-review3"><div class="lesson-num" style="color:var(--gold)">⭐ Tổng ôn từ vựng</div><div class="lesson-title-cn">500 từ HSK3</div><div class="lesson-title-vi">Flashcard · Trắc nghiệm · Điền từ</div><div class="lesson-meta"><span class="lesson-tag" style="background:#FFF8E0;color:#B8860B">500 từ</span></div></div>';
  let cards = HSK3.map(
    (l) =>
      '<div class="lesson-card hsk3" data-lesson="' +
      l.id +
      '" data-lv="hsk3"><div class="lesson-num" style="color:#27AE60">第' +
      l.id +
      "课 · Bài " +
      l.id +
      '</div><div class="lesson-title-cn">' +
      l.title +
      '</div><div class="lesson-title-vi">' +
      l.titleVi +
      '</div><div class="lesson-meta"><span class="lesson-tag" style="background:#EAFAF1;color:#27AE60">' +
      l.words.length +
      " từ</span></div></div>",
  ).join("");
  return (
    '<div class="section-title"><span class="badge" style="background:#27AE60">HSK 3</span> 新HSK教程 3 <span style="font-size:13px;color:var(--ink-light);font-family:Be Vietnam Pro;font-weight:400">· ' +
    getTotal(HSK3) +
    ' từ</span></div><div class="lesson-grid fade-in">' +
    rc3 +
    cards +
    "</div>"
  );
}

function renderHomeHSK4() {
  let gc4 =
    '<div class="lesson-card" style="border:2px dashed #2980B9;background:linear-gradient(135deg,#EBF5FB,#E8F4FC);cursor:pointer" data-action="open-grammarAdv" data-glv="hsk4"><div class="lesson-num" style="color:#2980B9">📖 Ngữ pháp HSK 4</div><div class="lesson-title-cn" style="font-size:18px">' +
    GRAMMAR_HSK4.length +
    ' điểm ngữ pháp</div><div class="lesson-title-vi">Phân loại theo nhóm</div></div>';
  let rc4 =
    '<div class="lesson-card review-card" data-action="open-review4"><div class="lesson-num" style="color:var(--gold)">⭐ Tổng ôn từ vựng</div><div class="lesson-title-cn">1000 từ HSK4</div><div class="lesson-title-vi">Flashcard · Trắc nghiệm · Điền từ</div><div class="lesson-meta"><span class="lesson-tag" style="background:#FFF8E0;color:#B8860B">1000 từ</span></div></div>';
  let cards = HSK4.map(
    (l) =>
      '<div class="lesson-card" style="border-left:3px solid #2980B9" data-lesson="' +
      l.id +
      '" data-lv="hsk4"><div class="lesson-num" style="color:#2980B9">第' +
      l.id +
      "课 · Bài " +
      l.id +
      '</div><div class="lesson-title-cn">' +
      l.title +
      '</div><div class="lesson-title-vi">' +
      l.titleVi +
      '</div><div class="lesson-meta"><span class="lesson-tag" style="background:#EBF5FB;color:#2980B9">' +
      l.words.length +
      " từ</span></div></div>",
  ).join("");
  return (
    '<div class="section-title"><span class="badge" style="background:#2980B9">HSK 4</span> 新HSK教程 4 <span style="font-size:13px;color:var(--ink-light);font-family:Be Vietnam Pro;font-weight:400">· ' +
    getTotal(HSK4) +
    ' từ · 50 bài</span></div><div class="lesson-grid fade-in">' +
    rc4 +
    gc4 +
    cards +
    "</div>"
  );
}

function renderHomeHSK456() {
  let html = "";
  const levels = [
    {
      all: HSK5_ALL,
      num: "5",
      color: "#1ABC9C",
      bg: "#E8F6F3",
      lv: "hsk5",
    },
    {
      all: HSK6_ALL,
      num: "6",
      color: "#F39C12",
      bg: "#FEF5E7",
      lv: "hsk6",
    },
  ];
  levels.forEach((d) => {
    const totalSets = Math.ceil(d.all.length / 20);
    let preview = "";
    let gd456 = {
      hsk5: GRAMMAR_HSK5,
      hsk6: GRAMMAR_HSK6,
    }[d.lv];
    if (gd456)
      preview =
        '<div class="lesson-card" style="border:2px dashed ' +
        d.color +
        ';background:linear-gradient(135deg,#FAFAFA,#F5F5F5);cursor:pointer" data-action="open-grammarAdv" data-glv="' +
        d.lv +
        '"><div class="lesson-num" style="color:' +
        d.color +
        '">📖 Ngữ pháp HSK ' +
        d.num +
        '</div><div class="lesson-title-cn" style="font-size:16px">' +
        gd456.length +
        ' điểm</div><div class="lesson-title-vi">Phân loại theo nhóm</div></div>';
    for (let i = 0; i < Math.min(4, totalSets); i++) {
      const start = i * 20 + 1,
        end = Math.min((i + 1) * 20, d.all.length);
      const words = d.all.slice(i * 20, i * 20 + 20);
      preview +=
        '<div class="lesson-card" style="border-left:3px solid ' +
        d.color +
        '" data-hsk456set="' +
        (i + 1) +
        '" data-nav-lv="' +
        d.lv +
        '"><div class="lesson-num" style="color:' +
        d.color +
        '">Mục ' +
        (i + 1) +
        '</div><div class="lesson-title-cn" style="font-size:17px">Từ ' +
        start +
        " – " +
        end +
        '</div><div class="lesson-title-vi" style="font-size:12px">' +
        words
          .slice(0, 4)
          .map((w) => w.h)
          .join(" · ") +
        '…</div><div class="lesson-meta"><span class="lesson-tag" style="background:' +
        d.bg +
        ";color:" +
        d.color +
        '">' +
        words.length +
        " từ</span></div></div>";
    }

    preview +=
      '<div class="lesson-card" style="border-left:3px solid ' +
      d.color +
      ';display:flex;align-items:center;justify-content:center;border-style:dashed;cursor:pointer" data-nav="level" data-lv="' +
      d.lv +
      '"><div style="text-align:center;color:' +
      d.color +
      ';font-weight:600;font-size:14px">Xem tất cả ' +
      totalSets +
      " mục →</div></div>";
    html +=
      '<div class="section-title"><span class="badge" style="background:' +
      d.color +
      '">HSK ' +
      d.num +
      "</span> Từ vựng HSK " +
      d.num +
      ' <span style="font-size:13px;color:var(--ink-light);font-family:Be Vietnam Pro;font-weight:400">· ' +
      d.all.length +
      " từ · " +
      totalSets +
      ' mục</span></div><div class="lesson-grid fade-in">' +
      preview +
      "</div>";
  });
  return html;
}

function renderHomeHSK79() {
  const sets = getHSK79Sets();
  let preview =
    '<div class="lesson-card" style="border:2px dashed #8E44AD;background:linear-gradient(135deg,#FAF5FF,#F3EAFF);cursor:pointer" data-action="open-grammarAdv" data-glv="hsk79"><div class="lesson-num" style="color:#8E44AD">📖 Ngữ pháp HSK 7-9</div><div class="lesson-title-cn" style="font-size:16px">' +
    GRAMMAR_HSK79G.length +
    ' điểm</div><div class="lesson-title-vi">Phân loại theo nhóm</div></div>';
  preview += sets
    .slice(0, 6)
    .map(
      (s) =>
        '<div class="lesson-card hsk79" data-hsk79set="' +
        s.id +
        '"><div class="lesson-num" style="color:#8E44AD">Mục ' +
        s.id +
        '</div><div class="lesson-title-cn" style="font-size:17px">Từ ' +
        s.start +
        " – " +
        s.end +
        '</div><div class="lesson-title-vi" style="font-size:12px">' +
        s.words
          .slice(0, 4)
          .map((w) => w.h)
          .join(" · ") +
        '…</div><div class="lesson-meta"><span class="lesson-tag" style="background:#F4ECF7;color:#8E44AD">' +
        s.words.length +
        " từ</span></div></div>",
    )
    .join("");
  preview +=
    '<div class="lesson-card hsk79" style="display:flex;align-items:center;justify-content:center;border-style:dashed;cursor:pointer" data-nav="level" data-lv="hsk79"><div style="text-align:center;color:#8E44AD;font-weight:600;font-size:14px">Xem tất cả ' +
    sets.length +
    " mục →</div></div>";
  return (
    '<div class="section-title"><span class="badge" style="background:#8E44AD">HSK 7-9</span> Từ vựng nâng cao <span style="font-size:13px;color:var(--ink-light);font-family:Be Vietnam Pro;font-weight:400">· ' +
    HSK79_ALL.length +
    " từ · " +
    sets.length +
    ' mục</span></div><div class="lesson-grid fade-in">' +
    preview +
    "</div>"
  );
}

function renderLevel() {
  if (state.level === "hsk4") return renderHSK4Level();
  if (
    state.level === "hsk5" ||
    state.level === "hsk6"
  )
    return renderHSK456Level();
  if (state.level === "hsk79") return renderHSK79Level();
  if (state.level === "hsk3") return renderHSK3Level();

  const lessons = state.level === "hsk1" ? HSK1 : HSK2;
  const lvNum = state.level === "hsk1" ? "1" : "2";
  const colorCls = state.level === "hsk2" ? " hsk2" : "";
  const total = getTotal(lessons);
  let grammarCard = "";
  if (state.level === "hsk1" && typeof GRAMMAR_HSK1 !== "undefined") {
    const gt = Object.values(GRAMMAR_HSK1).flat().length;
    grammarCard =
      '<div class="lesson-card" style="border:2px dashed #C0392B;background:linear-gradient(135deg,#FFF8F0,#FFF0E8)" data-action="open-grammar" data-glv="hsk1"><div class="lesson-num" style="color:#C0392B">📖 Ngữ pháp HSK 1</div><div class="lesson-title-cn" style="font-size:18px">' +
      gt +
      ' điểm ngữ pháp</div><div class="lesson-title-vi">Lý thuyết + Ví dụ theo từng bài</div></div>';
  }
  if (state.level === "hsk2" && typeof GRAMMAR_HSK2 !== "undefined") {
    const gt = Object.values(GRAMMAR_HSK2).flat().length;
    grammarCard =
      '<div class="lesson-card" style="border:2px dashed #E67E22;background:linear-gradient(135deg,#FFF8F0,#FFF3E8)" data-action="open-grammar" data-glv="hsk2"><div class="lesson-num" style="color:#E67E22">📖 Ngữ pháp HSK 2</div><div class="lesson-title-cn" style="font-size:18px">' +
      gt +
      ' điểm ngữ pháp</div><div class="lesson-title-vi">Lý thuyết + Ví dụ theo từng bài</div></div>';
  }
  let reviewCard =
    state.level === "hsk1"
      ? '<div class="lesson-card review-card" data-action="open-review"><div class="lesson-num" style="color:var(--gold)">⭐ Tổng ôn từ vựng</div><div class="lesson-title-cn">300 từ HSK1</div><div class="lesson-title-vi">Flashcard · Trắc nghiệm · Điền từ</div><div class="lesson-meta"><span class="lesson-tag" style="background:#FFF8E0;color:#B8860B">300 từ</span></div></div>'
      : '<div class="lesson-card review-card hsk2" data-action="open-review2"><div class="lesson-num" style="color:var(--gold)">⭐ Tổng ôn từ vựng</div><div class="lesson-title-cn">200 từ HSK2</div><div class="lesson-title-vi">Flashcard · Trắc nghiệm · Điền từ</div><div class="lesson-meta"><span class="lesson-tag" style="background:#FFF8E0;color:#B8860B">200 từ</span></div></div>';
  let cards = lessons
    .map(
      (l) =>
        '<div class="lesson-card' +
        colorCls +
        '" data-lesson="' +
        l.id +
        '" data-lv="' +
        state.level +
        '"><div class="lesson-num">第' +
        l.id +
        "课 · Bài " +
        l.id +
        '</div><div class="lesson-title-cn">' +
        l.title +
        '</div><div class="lesson-title-vi">' +
        l.titleVi +
        '</div><div class="lesson-meta"><span class="lesson-tag">' +
        l.words.length +
        " từ</span></div></div>",
    )
    .join("");
  return (
    '<div class="fade-in"><div style="text-align:center;padding:30px 20px 24px"><div class="section-title" style="justify-content:center;border:none;margin:0 0 8px"><span class="badge badge-' +
    state.level +
    '">HSK ' +
    lvNum +
    '</span> <span style="font-family:Noto Serif SC,serif">新HSK教程 ' +
    lvNum +
    '</span></div><p style="font-size:14px;color:var(--ink-light)">' +
    total +
    ' từ vựng · 15 bài học</p></div><div class="lesson-grid">' +
    reviewCard +
    grammarCard +
    cards +
    "</div></div>"
  );
}

function renderReview() {
  const words = HSK1_ALL;
  return (
    '<div class="fade-in"><button class="back-btn" data-action="back-review">← Quay lại</button><div class="lesson-view-title">⭐ Tổng ôn từ vựng HSK1</div><div class="lesson-view-sub">300 từ · Có Hán Việt + Ví dụ câu</div><div class="mode-tabs"><button class="mode-tab ' +
    (state.rMode === "list" ? "active" : "") +
    '" data-rmode="list">📋 Danh sách</button><button class="mode-tab ' +
    (state.rMode === "flashcard" ? "active" : "") +
    '" data-rmode="flashcard">🃏 Lật thẻ</button><button class="mode-tab ' +
    (state.rMode === "meaning" ? "active" : "") +
    '" data-rmode="meaning">✏️ Chọn nghĩa</button><button class="mode-tab ' +
    (state.rMode === "word" ? "active" : "") +
    '" data-rmode="word">🔄 Chọn từ</button><button class="mode-tab ' +
    (state.rMode === "hanviet" ? "active" : "") +
    '" data-rmode="fillin">📝 Điền từ</button></div>' +
    (state.rMode === "list" ? renderReviewList() : "") +
    (state.rMode === "flashcard" ? renderReviewFC() : "") +
    (state.rMode === "meaning" ? renderReviewQuiz("meaning") : "") +
    (state.rMode === "word" ? renderReviewQuiz("word") : "") +
    (state.rMode === "fillin" ? renderFillIn() : "") +
    "</div>"
  );
}

function renderReviewList() {
  let items = HSK1_ALL.map(
    (w) =>
      '<div class="word-item"><button class="audio-btn" data-speak="' +
      w.hanzi +
      '">🔊</button><div class="word-hanzi">' +
      w.hanzi +
      '</div><div class="word-info"><div class="word-pinyin">' +
      w.pinyin +
      ' <span style="color:var(--gold);font-size:12px">' +
      w.hv +
      '</span></div><div class="word-meaning">' +
      w.vi +
      '</div><div style="font-size:12px;color:#999;margin-top:3px;line-height:1.4">' +
      w.ex +
      '</div></div><div class="word-pos">' +
      w.pos +
      "</div></div>",
  ).join("");
  return (
    '<div class="toolbar"><span class="word-count">300 từ</span></div><div class="word-list">' +
    items +
    "</div>"
  );
}

function renderReviewFC() {
  if (
    !state.fcShuffled.length ||
    (state.fcShuffled[0].hv === undefined && HSK1_ALL[0].hv !== undefined)
  ) {
    state.fcShuffled = shuffle(HSK1_ALL);
    state.fcIndex = 0;
    state.fcFlipped = false;
  }
  const w = state.fcShuffled[state.fcIndex];
  return (
    '<div class="flashcard-container"><div class="flashcard-progress">' +
    (state.fcIndex + 1) +
    " / " +
    state.fcShuffled.length +
    '</div><div class="flashcard" data-action="flip"><div class="flashcard-inner ' +
    (state.fcFlipped ? "flipped" : "") +
    '"><div class="flashcard-front"><div class="fc-hanzi">' +
    w.hanzi +
    '</div><div class="fc-hint">Nhấn hoặc Space để lật · ← → chuyển từ</div></div><div class="flashcard-back"><div class="fc-pinyin">' +
    w.pinyin +
    '</div><div style="font-size:14px;color:rgba(255,255,255,0.6);margin-bottom:10px">' +
    w.hv +
    '</div><div class="fc-meaning">' +
    w.vi +
    '</div><div style="font-size:13px;color:rgba(255,255,255,0.5);margin-top:12px;line-height:1.5">' +
    w.ex +
    '</div></div></div></div><div class="fc-controls"><button class="fc-btn prev" data-action="fc-prev" ' +
    (state.fcIndex === 0 ? "disabled" : "") +
    '>← Trước</button><button class="shuffle-btn" data-action="fc-shuffle-review">🔀 Xáo trộn</button><button class="fc-btn next" data-action="fc-next" ' +
    (state.fcIndex >= state.fcShuffled.length - 1 ? "disabled" : "") +
    ">Tiếp →</button></div></div>"
  );
}

function renderReviewQuiz(type) {
  if (!state.quizQuestions.length || state.rQuizType !== type) {
    state.rQuizType = type;
    generateReviewQuiz(type);
  }
  if (state.quizDone) {
    const t = state.quizQuestions.length,
      p = Math.round((state.quizScore / t) * 100);
    let m =
      p >= 90
        ? "🎉 Xuất sắc!"
        : p >= 70
          ? "👍 Khá tốt!"
          : p >= 50
            ? "💪 Cần ôn thêm!"
            : "📚 Hãy ôn lại nhé!";
    return (
      '<div class="quiz-result fade-in"><div class="quiz-score">' +
      state.quizScore +
      "/" +
      t +
      '</div><div class="quiz-score-label">' +
      m +
      " Đúng " +
      p +
      '%</div><button class="quiz-restart" data-action="quiz-restart-review">Làm lại</button></div>'
    );
  }
  const q = state.quizQuestions[state.quizIndex],
    pr = (state.quizIndex / state.quizQuestions.length) * 100;
  let qDisplay = "",
    opts;
  if (type === "meaning") {
    qDisplay =
      '<div class="quiz-q-hanzi">' +
      q.prompt +
      '</div><div class="quiz-q-pinyin">' +
      q.subtext +
      "</div>";
    opts = q.options;
  } else if (type === "word") {
    qDisplay =
      '<div class="quiz-q-label" style="font-size:20px;color:var(--ink);font-weight:600;margin-bottom:4px">' +
      q.prompt +
      '</div><div class="quiz-q-pinyin" style="font-size:14px">' +
      q.subtext +
      "</div>";
    opts = q.options;
  } else {
    qDisplay =
      '<div class="quiz-q-hanzi">' +
      q.prompt +
      '</div><div class="quiz-q-pinyin">' +
      q.subtext +
      "</div>";
    opts = q.options;
  }
  let optHtml = opts
    .map((o, i) => {
      let c = "";
      if (state.quizAnswered) {
        if (i === q.ci) c = "correct";
        else if (i === q.sel) c = "wrong";
      }
      return (
        '<button class="quiz-option ' +
        c +
        '" data-quiz-opt="' +
        i +
        '" ' +
        (state.quizAnswered ? "disabled" : "") +
        ">" +
        o +
        "</button>"
      );
    })
    .join("");
  return (
    '<div class="quiz-container fade-in"><div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:' +
    pr +
    '%"></div></div><div class="quiz-question"><div class="quiz-q-label">Câu ' +
    (state.quizIndex + 1) +
    "/" +
    state.quizQuestions.length +
    "</div>" +
    qDisplay +
    '</div><div class="quiz-options">' +
    optHtml +
    "</div></div>"
  );
}

function generateReviewQuiz(type) {
  const words = shuffle(HSK1_ALL).slice(0, 30);
  const all = HSK1_ALL;
  if (type === "meaning") {
    state.quizQuestions = words.map((w) => {
      const isCn = Math.random() < 0.5;
      if (isCn) {
        let wr = shuffle(
          all.filter((x) => x.vi !== w.vi).map((x) => x.vi),
        ).slice(0, 3);
        let opts = shuffle([w.vi, ...wr]);
        return {
          prompt: w.hanzi,
          subtext: w.pinyin,
          ci: opts.indexOf(w.vi),
          options: opts,
          sel: -1,
        };
      } else {
        let wr = shuffle(
          all.filter((x) => x.hanzi !== w.hanzi).map((x) => x.hanzi),
        ).slice(0, 3);
        let opts = shuffle([w.hanzi, ...wr]);
        return {
          prompt: w.vi,
          subtext: "Chọn từ tiếng Trung đúng",
          ci: opts.indexOf(w.hanzi),
          options: opts,
          sel: -1,
        };
      }
    });
  } else if (type === "word") {
    state.quizQuestions = words.map((w) => {
      let wr = shuffle(
        all.filter((x) => x.hanzi !== w.hanzi).map((x) => x.hanzi),
      ).slice(0, 3);
      let opts = shuffle([w.hanzi, ...wr]);
      return {
        prompt: w.vi,
        subtext: "Chọn từ đúng",
        ci: opts.indexOf(w.hanzi),
        options: opts,
        sel: -1,
      };
    });
  }
  state.quizIndex = 0;
  state.quizScore = 0;
  state.quizAnswered = false;
  state.quizDone = false;
}

function renderFillIn() {
  if (!state.quizQuestions.length || state.rQuizType !== "fillin") {
    state.rQuizType = "fillin";
    generateFillIn();
  }
  if (state.quizDone) {
    const t = state.quizQuestions.length,
      p = Math.round((state.quizScore / t) * 100);
    let m =
      p >= 90
        ? "🎉 Xuất sắc!"
        : p >= 70
          ? "👍 Khá tốt!"
          : p >= 50
            ? "💪 Cần ôn thêm!"
            : "📚 Hãy ôn lại nhé!";
    return (
      '<div class="quiz-result fade-in"><div class="quiz-score">' +
      state.quizScore +
      "/" +
      t +
      '</div><div class="quiz-score-label">' +
      m +
      " Đúng " +
      p +
      '%</div><button class="quiz-restart" data-action="quiz-restart-review">Làm lại</button></div>'
    );
  }
  const q = state.quizQuestions[state.quizIndex],
    pr = (state.quizIndex / state.quizQuestions.length) * 100;
  let optHtml = q.options
    .map((o, i) => {
      let c = "";
      if (state.quizAnswered) {
        if (i === q.ci) c = "correct";
        else if (i === q.sel) c = "wrong";
      }
      return (
        '<button class="quiz-option ' +
        c +
        '" data-quiz-opt="' +
        i +
        '" ' +
        (state.quizAnswered ? "disabled" : "") +
        ">" +
        o +
        "</button>"
      );
    })
    .join("");
  return (
    '<div class="quiz-container fade-in"><div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:' +
    pr +
    '%"></div></div><div class="quiz-question"><div class="quiz-q-label">Câu ' +
    (state.quizIndex + 1) +
    "/" +
    state.quizQuestions.length +
    ' — Điền từ vào chỗ trống</div><div style="font-family:Noto Sans SC,sans-serif;font-size:24px;font-weight:500;color:var(--ink);line-height:1.6;margin:12px 0">' +
    q.sentence +
    '</div><div class="quiz-q-pinyin" style="font-size:13px">' +
    q.hint +
    '</div></div><div class="quiz-options">' +
    optHtml +
    "</div></div>"
  );
}

function generateFillIn() {
  const pool = HSK1_ALL.filter((w) => w.ex && w.ex.length > 2);
  const words = shuffle(pool).slice(0, 20);
  const all = HSK1_ALL;
  state.quizQuestions = words.map((w) => {
    let ex = w.ex;
    let idx = ex.indexOf("(");
    let cnPart = idx > 0 ? ex.substring(0, idx).trim() : ex;
    let viPart = idx > 0 ? ex.substring(idx) : "";
    let blank = cnPart.replace(w.hanzi, "______");
    if (blank === cnPart) {
      let h = w.hanzi;
      for (let i = 0; i < h.length; i++) {
        let ch = h.charAt(i);
        if (cnPart.indexOf(ch) >= 0) {
          blank = cnPart.replace(ch, "__");
          break;
        }
      }
    }
    let wr = shuffle(
      all.filter((x) => x.hanzi !== w.hanzi).map((x) => x.hanzi),
    ).slice(0, 3);
    let opts = shuffle([w.hanzi, ...wr]);
    return {
      sentence: blank,
      hint: viPart || w.vi,
      ci: opts.indexOf(w.hanzi),
      options: opts,
      sel: -1,
    };
  });
  state.quizIndex = 0;
  state.quizScore = 0;
  state.quizAnswered = false;
  state.quizDone = false;
}

function renderReview2() {
  return (
    '<div class="fade-in"><button class="back-btn" data-action="back-review2">← Quay lại</button><div class="lesson-view-title">⭐ Tổng ôn từ vựng HSK2</div><div class="lesson-view-sub">200 từ · Có Hán Việt + Ví dụ câu</div><div class="mode-tabs"><button class="mode-tab ' +
    (state.rMode === "list" ? "active" : "") +
    '" data-rmode2="list">📋 Danh sách</button><button class="mode-tab ' +
    (state.rMode === "flashcard" ? "active" : "") +
    '" data-rmode2="flashcard">🃏 Lật thẻ</button><button class="mode-tab ' +
    (state.rMode === "meaning" ? "active" : "") +
    '" data-rmode2="meaning">✏️ Chọn nghĩa</button><button class="mode-tab ' +
    (state.rMode === "word" ? "active" : "") +
    '" data-rmode2="word">🔄 Chọn từ</button><button class="mode-tab ' +
    (state.rMode === "fillin" ? "active" : "") +
    '" data-rmode2="fillin">📝 Điền từ</button></div>' +
    (state.rMode === "list" ? renderR2List() : "") +
    (state.rMode === "flashcard" ? renderR2FC() : "") +
    (state.rMode === "meaning" ? renderR2Quiz("meaning") : "") +
    (state.rMode === "word" ? renderR2Quiz("word") : "") +
    (state.rMode === "fillin" ? renderR2FillIn() : "") +
    "</div>"
  );
}
function renderR2List() {
  let items = HSK2_ALL.map(
    (w) =>
      '<div class="word-item"><button class="audio-btn" data-speak="' +
      w.hanzi +
      '">🔊</button><div class="word-hanzi">' +
      w.hanzi +
      '</div><div class="word-info"><div class="word-pinyin">' +
      w.pinyin +
      ' <span style="color:var(--gold);font-size:12px">' +
      w.hv +
      '</span></div><div class="word-meaning">' +
      w.vi +
      '</div><div style="font-size:12px;color:#999;margin-top:3px;line-height:1.4">' +
      w.ex +
      '</div></div><div class="word-pos">' +
      w.pos +
      "</div></div>",
  ).join("");
  return (
    '<div class="toolbar"><span class="word-count">200 từ</span></div><div class="word-list">' +
    items +
    "</div>"
  );
}
function renderR2FC() {
  if (!state.fcShuffled.length || !state.fcShuffled[0].hv) {
    state.fcShuffled = shuffle(HSK2_ALL);
    state.fcIndex = 0;
    state.fcFlipped = false;
  }
  const w = state.fcShuffled[state.fcIndex];
  return (
    '<div class="flashcard-container"><div class="flashcard-progress">' +
    (state.fcIndex + 1) +
    " / " +
    state.fcShuffled.length +
    '</div><div class="flashcard" data-action="flip"><div class="flashcard-inner ' +
    (state.fcFlipped ? "flipped" : "") +
    '"><div class="flashcard-front"><div class="fc-hanzi">' +
    w.hanzi +
    '</div><button class="audio-btn" data-speak="' +
    w.hanzi +
    '" style="font-size:28px;opacity:0.7;margin:8px 0" onclick="event.stopPropagation()">🔊</button><div class="fc-hint">Nhấn hoặc Space để lật · ← → chuyển từ</div></div><div class="flashcard-back"><div class="fc-pinyin">' +
    w.pinyin +
    '</div><div style="font-size:14px;color:rgba(255,255,255,0.6);margin-bottom:10px">' +
    w.hv +
    '</div><div class="fc-meaning">' +
    w.vi +
    '</div><div style="font-size:13px;color:rgba(255,255,255,0.5);margin-top:12px;line-height:1.5">' +
    w.ex +
    '</div></div></div></div><div class="fc-controls"><button class="fc-btn prev" data-action="fc-prev" ' +
    (state.fcIndex === 0 ? "disabled" : "") +
    '>← Trước</button><button class="shuffle-btn" data-action="fc-shuffle-r2">🔀 Xáo trộn</button><button class="fc-btn next" data-action="fc-next" ' +
    (state.fcIndex >= state.fcShuffled.length - 1 ? "disabled" : "") +
    ">Tiếp →</button></div></div>"
  );
}
function renderR2Quiz(type) {
  if (!state.quizQuestions.length || state.rQuizType !== "r2_" + type) {
    state.rQuizType = "r2_" + type;
    genR2Quiz(type);
  }
  if (state.quizDone) {
    const t = state.quizQuestions.length,
      p = Math.round((state.quizScore / t) * 100);
    let m =
      p >= 90
        ? "🎉 Xuất sắc!"
        : p >= 70
          ? "👍 Khá tốt!"
          : p >= 50
            ? "💪 Cần ôn thêm!"
            : "📚 Hãy ôn lại nhé!";
    return (
      '<div class="quiz-result fade-in"><div class="quiz-score">' +
      state.quizScore +
      "/" +
      t +
      '</div><div class="quiz-score-label">' +
      m +
      " Đúng " +
      p +
      '%</div><button class="quiz-restart" data-action="quiz-restart-r2">Làm lại</button></div>'
    );
  }
  const q = state.quizQuestions[state.quizIndex],
    pr = (state.quizIndex / state.quizQuestions.length) * 100;
  let optHtml = q.options
    .map((o, i) => {
      let c = "";
      if (state.quizAnswered) {
        if (i === q.ci) c = "correct";
        else if (i === q.sel) c = "wrong";
      }
      return (
        '<button class="quiz-option ' +
        c +
        '" data-quiz-opt="' +
        i +
        '" ' +
        (state.quizAnswered ? "disabled" : "") +
        ">" +
        o +
        "</button>"
      );
    })
    .join("");
  return (
    '<div class="quiz-container fade-in"><div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:' +
    pr +
    '%"></div></div><div class="quiz-question"><div class="quiz-q-label">Câu ' +
    (state.quizIndex + 1) +
    "/" +
    state.quizQuestions.length +
    '</div><div class="quiz-q-hanzi" style="' +
    (q.st ? "font-size:22px;font-family:Be Vietnam Pro,sans-serif" : "") +
    '">' +
    q.prompt +
    '</div><div class="quiz-q-pinyin">' +
    q.subtext +
    '</div></div><div class="quiz-options">' +
    optHtml +
    "</div></div>"
  );
}
function genR2Quiz(type) {
  const words = shuffle(HSK2_ALL).slice(0, 30);
  const all = HSK2_ALL;
  if (type === "meaning") {
    state.quizQuestions = words.map((w) => {
      const c = Math.random() < 0.5;
      if (c) {
        let wr = shuffle(
          all.filter((x) => x.vi !== w.vi).map((x) => x.vi),
        ).slice(0, 3);
        let opts = shuffle([w.vi, ...wr]);
        return {
          prompt: w.hanzi,
          subtext: w.pinyin,
          ci: opts.indexOf(w.vi),
          options: opts,
          sel: -1,
        };
      } else {
        let wr = shuffle(
          all.filter((x) => x.hanzi !== w.hanzi).map((x) => x.hanzi),
        ).slice(0, 3);
        let opts = shuffle([w.hanzi, ...wr]);
        return {
          prompt: w.vi,
          subtext: "Chọn từ tiếng Trung đúng",
          ci: opts.indexOf(w.hanzi),
          options: opts,
          sel: -1,
          st: 1,
        };
      }
    });
  } else {
    state.quizQuestions = words.map((w) => {
      let wr = shuffle(
        all.filter((x) => x.hanzi !== w.hanzi).map((x) => x.hanzi),
      ).slice(0, 3);
      let opts = shuffle([w.hanzi, ...wr]);
      return {
        prompt: w.vi,
        subtext: "Chọn từ đúng",
        ci: opts.indexOf(w.hanzi),
        options: opts,
        sel: -1,
        st: 1,
      };
    });
  }
  state.quizIndex = 0;
  state.quizScore = 0;
  state.quizAnswered = false;
  state.quizDone = false;
}
function renderR2FillIn() {
  if (!state.quizQuestions.length || state.rQuizType !== "r2_fillin") {
    state.rQuizType = "r2_fillin";
    genR2FillIn();
  }
  if (state.quizDone) {
    const t = state.quizQuestions.length,
      p = Math.round((state.quizScore / t) * 100);
    let m =
      p >= 90
        ? "🎉 Xuất sắc!"
        : p >= 70
          ? "👍 Khá tốt!"
          : p >= 50
            ? "💪 Cần ôn thêm!"
            : "📚 Hãy ôn lại nhé!";
    return (
      '<div class="quiz-result fade-in"><div class="quiz-score">' +
      state.quizScore +
      "/" +
      t +
      '</div><div class="quiz-score-label">' +
      m +
      " Đúng " +
      p +
      '%</div><button class="quiz-restart" data-action="quiz-restart-r2">Làm lại</button></div>'
    );
  }
  const q = state.quizQuestions[state.quizIndex],
    pr = (state.quizIndex / state.quizQuestions.length) * 100;
  let optHtml = q.options
    .map((o, i) => {
      let c = "";
      if (state.quizAnswered) {
        if (i === q.ci) c = "correct";
        else if (i === q.sel) c = "wrong";
      }
      return (
        '<button class="quiz-option ' +
        c +
        '" data-quiz-opt="' +
        i +
        '" ' +
        (state.quizAnswered ? "disabled" : "") +
        ">" +
        o +
        "</button>"
      );
    })
    .join("");
  return (
    '<div class="quiz-container fade-in"><div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:' +
    pr +
    '%"></div></div><div class="quiz-question"><div class="quiz-q-label">Câu ' +
    (state.quizIndex + 1) +
    "/" +
    state.quizQuestions.length +
    ' — Điền từ vào chỗ trống</div><div style="font-family:Noto Sans SC,sans-serif;font-size:24px;font-weight:500;color:var(--ink);line-height:1.6;margin:12px 0">' +
    q.sentence +
    '</div><div class="quiz-q-pinyin" style="font-size:13px">' +
    q.hint +
    '</div></div><div class="quiz-options">' +
    optHtml +
    "</div></div>"
  );
}
function genR2FillIn() {
  const pool = HSK2_ALL.filter((w) => w.ex && w.ex.length > 2);
  const words = shuffle(pool).slice(0, 20);
  const all = HSK2_ALL;
  state.quizQuestions = words.map((w) => {
    let ex = w.ex;
    let idx = ex.indexOf("(");
    let cn = idx > 0 ? ex.substring(0, idx).trim() : ex;
    let vi = idx > 0 ? ex.substring(idx) : "";
    let blank = cn.replace(w.hanzi, "______");
    if (blank === cn) {
      for (let i = 0; i < w.hanzi.length; i++) {
        let ch = w.hanzi.charAt(i);
        if (cn.indexOf(ch) >= 0) {
          blank = cn.replace(ch, "__");
          break;
        }
      }
    }
    let wr = shuffle(
      all.filter((x) => x.hanzi !== w.hanzi).map((x) => x.hanzi),
    ).slice(0, 3);
    let opts = shuffle([w.hanzi, ...wr]);
    return {
      sentence: blank,
      hint: vi || w.vi,
      ci: opts.indexOf(w.hanzi),
      options: opts,
      sel: -1,
    };
  });
  state.quizIndex = 0;
  state.quizScore = 0;
  state.quizAnswered = false;
  state.quizDone = false;
}

function renderReview3() {
  return (
    '<div class="fade-in"><button class="back-btn" data-action="back-review3">← Quay lại</button><div class="lesson-view-title">⭐ Tổng ôn từ vựng HSK3</div><div class="lesson-view-sub">500 từ · Có Hán Việt + Ví dụ câu</div><div class="mode-tabs"><button class="mode-tab ' +
    (state.rMode === "list" ? "active" : "") +
    '" data-rmode3="list">📋 Danh sách</button><button class="mode-tab ' +
    (state.rMode === "flashcard" ? "active" : "") +
    '" data-rmode3="flashcard">🃏 Lật thẻ</button><button class="mode-tab ' +
    (state.rMode === "meaning" ? "active" : "") +
    '" data-rmode3="meaning">✏️ Chọn nghĩa</button><button class="mode-tab ' +
    (state.rMode === "word" ? "active" : "") +
    '" data-rmode3="word">🔄 Chọn từ</button><button class="mode-tab ' +
    (state.rMode === "fillin" ? "active" : "") +
    '" data-rmode3="fillin">📝 Điền từ</button></div>' +
    (state.rMode === "list" ? r3List() : "") +
    (state.rMode === "flashcard" ? r3FC() : "") +
    (state.rMode === "meaning" || state.rMode === "word"
      ? r3Quiz(state.rMode)
      : "") +
    (state.rMode === "fillin" ? r3Fill() : "") +
    "</div>"
  );
}
function r3List() {
  let items = HSK3_ALL.map(
    (w) =>
      '<div class="word-item"><button class="audio-btn" data-speak="' +
      w.hanzi +
      '">🔊</button><div class="word-hanzi">' +
      w.hanzi +
      '</div><div class="word-info"><div class="word-pinyin">' +
      w.pinyin +
      ' <span style="color:var(--gold);font-size:12px">' +
      w.hv +
      '</span></div><div class="word-meaning">' +
      w.vi +
      '</div><div style="font-size:12px;color:#999;margin-top:3px;line-height:1.4">' +
      w.ex +
      '</div></div><div class="word-pos">' +
      w.pos +
      "</div></div>",
  ).join("");
  return (
    '<div class="toolbar"><span class="word-count">500 từ</span></div><div class="word-list">' +
    items +
    "</div>"
  );
}
function r3FC() {
  if (!state.fcShuffled.length || !state.fcShuffled[0].hv) {
    state.fcShuffled = shuffle(HSK3_ALL);
    state.fcIndex = 0;
    state.fcFlipped = false;
  }
  const w = state.fcShuffled[state.fcIndex];
  return (
    '<div class="flashcard-container"><div class="flashcard-progress">' +
    (state.fcIndex + 1) +
    " / " +
    state.fcShuffled.length +
    '</div><div class="flashcard" data-action="flip"><div class="flashcard-inner ' +
    (state.fcFlipped ? "flipped" : "") +
    '"><div class="flashcard-front"><div class="fc-hanzi">' +
    w.hanzi +
    '</div><button class="audio-btn" data-speak="' +
    w.hanzi +
    '" style="font-size:28px;opacity:0.7;margin:8px 0" onclick="event.stopPropagation()">🔊</button><div class="fc-hint">Nhấn hoặc Space để lật · ← → chuyển từ</div></div><div class="flashcard-back"><div class="fc-pinyin">' +
    w.pinyin +
    '</div><div style="font-size:14px;color:rgba(255,255,255,0.6);margin-bottom:10px">' +
    w.hv +
    '</div><div class="fc-meaning">' +
    w.vi +
    '</div><div style="font-size:13px;color:rgba(255,255,255,0.5);margin-top:12px;line-height:1.5">' +
    w.ex +
    '</div></div></div></div><div class="fc-controls"><button class="fc-btn prev" data-action="fc-prev" ' +
    (state.fcIndex === 0 ? "disabled" : "") +
    '>← Trước</button><button class="shuffle-btn" data-action="fc-shuffle-r3">🔀 Xáo trộn</button><button class="fc-btn next" data-action="fc-next" ' +
    (state.fcIndex >= state.fcShuffled.length - 1 ? "disabled" : "") +
    ">Tiếp →</button></div></div>"
  );
}
function r3Quiz(type) {
  if (!state.quizQuestions.length || state.rQuizType !== "r3_" + type) {
    state.rQuizType = "r3_" + type;
    genR3Quiz(type);
  }
  if (state.quizDone) {
    const t = state.quizQuestions.length,
      p = Math.round((state.quizScore / t) * 100);
    let m =
      p >= 90
        ? "🎉 Xuất sắc!"
        : p >= 70
          ? "👍 Khá tốt!"
          : p >= 50
            ? "💪 Cần ôn thêm!"
            : "📚 Hãy ôn lại nhé!";
    return (
      '<div class="quiz-result fade-in"><div class="quiz-score">' +
      state.quizScore +
      "/" +
      t +
      '</div><div class="quiz-score-label">' +
      m +
      " Đúng " +
      p +
      '%</div><button class="quiz-restart" data-action="quiz-restart-r3">Làm lại</button></div>'
    );
  }
  const q = state.quizQuestions[state.quizIndex],
    pr = (state.quizIndex / state.quizQuestions.length) * 100;
  let optHtml = q.options
    .map((o, i) => {
      let c = "";
      if (state.quizAnswered) {
        if (i === q.ci) c = "correct";
        else if (i === q.sel) c = "wrong";
      }
      return (
        '<button class="quiz-option ' +
        c +
        '" data-quiz-opt="' +
        i +
        '" ' +
        (state.quizAnswered ? "disabled" : "") +
        ' style="' +
        (q.isCn
          ? "font-family:Noto Sans SC,sans-serif;font-size:20px"
          : "") +
        '">' +
        o +
        "</button>"
      );
    })
    .join("");
  return (
    '<div class="quiz-container fade-in"><div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:' +
    pr +
    '%"></div></div><div class="quiz-question"><div class="quiz-q-label">Câu ' +
    (state.quizIndex + 1) +
    "/" +
    state.quizQuestions.length +
    '</div><div class="quiz-q-hanzi" style="' +
    (q.isCn ? "" : "") +
    '">' +
    q.prompt +
    '</div><div class="quiz-q-pinyin">' +
    q.sub +
    '</div></div><div class="quiz-options">' +
    optHtml +
    "</div></div>"
  );
}
function genR3Quiz(type) {
  const words = shuffle(HSK3_ALL).slice(0, 30);
  const all = HSK3_ALL;
  if (type === "meaning") {
    state.quizQuestions = words.map((w) => {
      const cn = Math.random() < 0.5;
      if (cn) {
        let wr = shuffle(
          all.filter((x) => x.vi !== w.vi).map((x) => x.vi),
        ).slice(0, 3);
        let opts = shuffle([w.vi, ...wr]);
        return {
          prompt: w.hanzi,
          sub: w.pinyin,
          ci: opts.indexOf(w.vi),
          options: opts,
          sel: -1,
          isCn: false,
        };
      } else {
        let wr = shuffle(
          all.filter((x) => x.hanzi !== w.hanzi).map((x) => x.hanzi),
        ).slice(0, 3);
        let opts = shuffle([w.hanzi, ...wr]);
        return {
          prompt: w.vi,
          sub: "Chọn từ tiếng Trung đúng",
          ci: opts.indexOf(w.hanzi),
          options: opts,
          sel: -1,
          isCn: true,
        };
      }
    });
  } else {
    state.quizQuestions = words.map((w) => {
      let wr = shuffle(
        all.filter((x) => x.hanzi !== w.hanzi).map((x) => x.hanzi),
      ).slice(0, 3);
      let opts = shuffle([w.hanzi, ...wr]);
      return {
        prompt: w.vi,
        sub: "Chọn từ đúng",
        ci: opts.indexOf(w.hanzi),
        options: opts,
        sel: -1,
        isCn: true,
      };
    });
  }
  state.quizIndex = 0;
  state.quizScore = 0;
  state.quizAnswered = false;
  state.quizDone = false;
}
function r3Fill() {
  if (!state.quizQuestions.length || state.rQuizType !== "r3_fillin") {
    state.rQuizType = "r3_fillin";
    genR3Fill();
  }
  if (state.quizDone) {
    const t = state.quizQuestions.length,
      p = Math.round((state.quizScore / t) * 100);
    let m =
      p >= 90
        ? "🎉 Xuất sắc!"
        : p >= 70
          ? "👍 Khá tốt!"
          : p >= 50
            ? "💪 Cần ôn thêm!"
            : "📚 Hãy ôn lại nhé!";
    return (
      '<div class="quiz-result fade-in"><div class="quiz-score">' +
      state.quizScore +
      "/" +
      t +
      '</div><div class="quiz-score-label">' +
      m +
      " Đúng " +
      p +
      '%</div><button class="quiz-restart" data-action="quiz-restart-r3">Làm lại</button></div>'
    );
  }
  const q = state.quizQuestions[state.quizIndex],
    pr = (state.quizIndex / state.quizQuestions.length) * 100;
  let optHtml = q.options
    .map((o, i) => {
      let c = "";
      if (state.quizAnswered) {
        if (i === q.ci) c = "correct";
        else if (i === q.sel) c = "wrong";
      }
      return (
        '<button class="quiz-option ' +
        c +
        '" data-quiz-opt="' +
        i +
        '" ' +
        (state.quizAnswered ? "disabled" : "") +
        ">" +
        o +
        "</button>"
      );
    })
    .join("");
  return (
    '<div class="quiz-container fade-in"><div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:' +
    pr +
    '%"></div></div><div class="quiz-question"><div class="quiz-q-label">Câu ' +
    (state.quizIndex + 1) +
    "/" +
    state.quizQuestions.length +
    ' — Điền từ vào chỗ trống</div><div style="font-family:Noto Sans SC,sans-serif;font-size:24px;font-weight:500;color:var(--ink);line-height:1.6;margin:12px 0">' +
    q.sentence +
    '</div><div class="quiz-q-pinyin" style="font-size:13px">' +
    q.hint +
    '</div></div><div class="quiz-options">' +
    optHtml +
    "</div></div>"
  );
}
function genR3Fill() {
  const pool = HSK3_ALL.filter((w) => w.ex && w.ex.length > 3);
  const all = HSK3_ALL;
  const words = shuffle(pool).slice(0, 20);
  state.quizQuestions = words.map((w) => {
    let ex = w.ex;
    let idx = ex.indexOf("(");
    let cn =
      idx > 0
        ? ex.substring(0, idx).trim()
        : ex.split("；")[0].split(";")[0];
    let vi = idx > 0 ? ex.substring(idx) : w.vi;
    let blank = cn.replace(w.hanzi, "______");
    if (blank === cn) {
      for (let i = 0; i < w.hanzi.length; i++) {
        let ch = w.hanzi.charAt(i);
        if (cn.indexOf(ch) >= 0) {
          blank = cn.replace(ch, "__");
          break;
        }
      }
    }
    let wr = shuffle(
      all.filter((x) => x.hanzi !== w.hanzi).map((x) => x.hanzi),
    ).slice(0, 3);
    let opts = shuffle([w.hanzi, ...wr]);
    return {
      sentence: blank,
      hint: vi || w.vi,
      ci: opts.indexOf(w.hanzi),
      options: opts,
      sel: -1,
    };
  });
  state.quizIndex = 0;
  state.quizScore = 0;
  state.quizAnswered = false;
  state.quizDone = false;
}

function renderReview4() {
  return (
    '<div class="fade-in"><button class="back-btn" data-action="back-review4">← Quay lại</button><div class="lesson-view-title">⭐ Tổng ôn từ vựng HSK4</div><div class="lesson-view-sub">1000 từ · Có Hán Việt + Ví dụ câu</div><div class="mode-tabs"><button class="mode-tab ' +
    (state.rMode === "list" ? "active" : "") +
    '" data-rmode4="list">📋 Danh sách</button><button class="mode-tab ' +
    (state.rMode === "flashcard" ? "active" : "") +
    '" data-rmode4="flashcard">🃏 Lật thẻ</button><button class="mode-tab ' +
    (state.rMode === "meaning" ? "active" : "") +
    '" data-rmode4="meaning">✏️ Chọn nghĩa</button><button class="mode-tab ' +
    (state.rMode === "word" ? "active" : "") +
    '" data-rmode4="word">🔄 Chọn từ</button><button class="mode-tab ' +
    (state.rMode === "fillin" ? "active" : "") +
    '" data-rmode4="fillin">📝 Điền từ</button></div>' +
    (state.rMode === "list" ? r4List() : "") +
    (state.rMode === "flashcard" ? r4FC() : "") +
    (state.rMode === "meaning" || state.rMode === "word"
      ? r4Quiz(state.rMode)
      : "") +
    (state.rMode === "fillin" ? r4Fill() : "") +
    "</div>"
  );
}
function r4List() {
  let items = HSK4_ALL.map(
    (w) =>
      '<div class="word-item"><button class="audio-btn" data-speak="' +
      wHz(w) +
      '">🔊</button><div class="word-hanzi">' +
      wHz(w) +
      '</div><div class="word-info"><div class="word-pinyin">' +
      wPy(w) +
      ' <span style="color:var(--gold);font-size:12px">' +
      wHv(w) +
      '</span></div><div class="word-meaning">' +
      wVi(w) +
      '</div><div style="font-size:12px;color:#999;margin-top:3px;line-height:1.4">' +
      wEx(w) +
      '</div></div><div class="word-pos">' +
      wPos(w) +
      "</div></div>",
  ).join("");
  return (
    '<div class="toolbar"><span class="word-count">1000 từ</span></div><div class="word-list">' +
    items +
    "</div>"
  );
}
function r4FC() {
  if (!state.fcShuffled.length || !state.fcShuffled[0].h) {
    state.fcShuffled = shuffle(HSK4_ALL);
    state.fcIndex = 0;
    state.fcFlipped = false;
  }
  const w = state.fcShuffled[state.fcIndex];
  return (
    '<div class="flashcard-container"><div class="flashcard-progress">' +
    (state.fcIndex + 1) +
    " / " +
    state.fcShuffled.length +
    '</div><div class="flashcard" data-action="flip"><div class="flashcard-inner ' +
    (state.fcFlipped ? "flipped" : "") +
    '"><div class="flashcard-front"><div class="fc-hanzi">' +
    wHz(w) +
    '</div><button class="audio-btn" data-speak="' +
    wHz(w) +
    '" style="font-size:28px;opacity:0.7;margin:8px 0" onclick="event.stopPropagation()">🔊</button><div class="fc-hint">Nhấn hoặc Space để lật · ← → chuyển từ</div></div><div class="flashcard-back"><div class="fc-pinyin">' +
    wPy(w) +
    '</div><div style="font-size:14px;color:rgba(255,255,255,0.6);margin-bottom:10px">' +
    wHv(w) +
    '</div><div class="fc-meaning">' +
    wVi(w) +
    '</div><div style="font-size:13px;color:rgba(255,255,255,0.5);margin-top:12px;line-height:1.5">' +
    wEx(w) +
    '</div></div></div></div><div class="fc-controls"><button class="fc-btn prev" data-action="fc-prev" ' +
    (state.fcIndex === 0 ? "disabled" : "") +
    '>← Trước</button><button class="shuffle-btn" data-action="fc-shuffle-r4">🔀 Xáo trộn</button><button class="fc-btn next" data-action="fc-next" ' +
    (state.fcIndex >= state.fcShuffled.length - 1 ? "disabled" : "") +
    ">Tiếp →</button></div></div>"
  );
}
function r4Quiz(type) {
  if (!state.quizQuestions.length || state.rQuizType !== "r4_" + type) {
    state.rQuizType = "r4_" + type;
    genR4Quiz(type);
  }
  if (state.quizDone) {
    const t = state.quizQuestions.length,
      p = Math.round((state.quizScore / t) * 100);
    let m =
      p >= 90
        ? "🎉 Xuất sắc!"
        : p >= 70
          ? "👍 Khá tốt!"
          : p >= 50
            ? "💪 Cần ôn thêm!"
            : "📚 Hãy ôn lại nhé!";
    return (
      '<div class="quiz-result fade-in"><div class="quiz-score">' +
      state.quizScore +
      "/" +
      t +
      '</div><div class="quiz-score-label">' +
      m +
      " Đúng " +
      p +
      '%</div><button class="quiz-restart" data-action="quiz-restart-r4">Làm lại</button></div>'
    );
  }
  const q = state.quizQuestions[state.quizIndex],
    pr = (state.quizIndex / state.quizQuestions.length) * 100;
  let optHtml = q.options
    .map((o, i) => {
      let c = "";
      if (state.quizAnswered) {
        if (i === q.ci) c = "correct";
        else if (i === q.sel) c = "wrong";
      }
      return (
        '<button class="quiz-option ' +
        c +
        '" data-quiz-opt="' +
        i +
        '" ' +
        (state.quizAnswered ? "disabled" : "") +
        ' style="' +
        (q.isCn
          ? "font-family:Noto Sans SC,sans-serif;font-size:20px"
          : "") +
        '">' +
        o +
        "</button>"
      );
    })
    .join("");
  return (
    '<div class="quiz-container fade-in"><div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:' +
    pr +
    '%"></div></div><div class="quiz-question"><div class="quiz-q-label">Câu ' +
    (state.quizIndex + 1) +
    "/" +
    state.quizQuestions.length +
    '</div><div class="quiz-q-hanzi">' +
    q.prompt +
    '</div><div class="quiz-q-pinyin">' +
    q.sub +
    '</div></div><div class="quiz-options">' +
    optHtml +
    "</div></div>"
  );
}
function genR4Quiz(type) {
  const words = shuffle(HSK4_ALL).slice(0, 30);
  const all = HSK4_ALL;
  if (type === "meaning") {
    state.quizQuestions = words.map((w) => {
      const cn = Math.random() < 0.5;
      if (cn) {
        let wr = shuffle(
          all.filter((x) => wVi(x) !== wVi(w)).map((x) => wVi(x)),
        ).slice(0, 3);
        let opts = shuffle([wVi(w), ...wr]);
        return {
          prompt: wHz(w),
          sub: wPy(w),
          ci: opts.indexOf(wVi(w)),
          options: opts,
          sel: -1,
          isCn: false,
        };
      } else {
        let wr = shuffle(
          all.filter((x) => wHz(x) !== wHz(w)).map((x) => wHz(x)),
        ).slice(0, 3);
        let opts = shuffle([wHz(w), ...wr]);
        return {
          prompt: wVi(w),
          sub: "Chọn từ tiếng Trung đúng",
          ci: opts.indexOf(wHz(w)),
          options: opts,
          sel: -1,
          isCn: true,
        };
      }
    });
  } else {
    state.quizQuestions = words.map((w) => {
      let wr = shuffle(
        all.filter((x) => wHz(x) !== wHz(w)).map((x) => wHz(x)),
      ).slice(0, 3);
      let opts = shuffle([wHz(w), ...wr]);
      return {
        prompt: wVi(w),
        sub: "Chọn từ đúng",
        ci: opts.indexOf(wHz(w)),
        options: opts,
        sel: -1,
        isCn: true,
      };
    });
  }
  state.quizIndex = 0;
  state.quizScore = 0;
  state.quizAnswered = false;
  state.quizDone = false;
}
function r4Fill() {
  if (!state.quizQuestions.length || state.rQuizType !== "r4_fillin") {
    state.rQuizType = "r4_fillin";
    genR4Fill();
  }
  if (state.quizDone) {
    const t = state.quizQuestions.length,
      p = Math.round((state.quizScore / t) * 100);
    let m =
      p >= 90
        ? "🎉 Xuất sắc!"
        : p >= 70
          ? "👍 Khá tốt!"
          : p >= 50
            ? "💪 Cần ôn thêm!"
            : "📚 Hãy ôn lại nhé!";
    return (
      '<div class="quiz-result fade-in"><div class="quiz-score">' +
      state.quizScore +
      "/" +
      t +
      '</div><div class="quiz-score-label">' +
      m +
      " Đúng " +
      p +
      '%</div><button class="quiz-restart" data-action="quiz-restart-r4">Làm lại</button></div>'
    );
  }
  const q = state.quizQuestions[state.quizIndex],
    pr = (state.quizIndex / state.quizQuestions.length) * 100;
  let optHtml = q.options
    .map((o, i) => {
      let c = "";
      if (state.quizAnswered) {
        if (i === q.ci) c = "correct";
        else if (i === q.sel) c = "wrong";
      }
      return (
        '<button class="quiz-option ' +
        c +
        '" data-quiz-opt="' +
        i +
        '" ' +
        (state.quizAnswered ? "disabled" : "") +
        ">" +
        o +
        "</button>"
      );
    })
    .join("");
  return (
    '<div class="quiz-container fade-in"><div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:' +
    pr +
    '%"></div></div><div class="quiz-question"><div class="quiz-q-label">Câu ' +
    (state.quizIndex + 1) +
    "/" +
    state.quizQuestions.length +
    ' — Điền từ vào chỗ trống</div><div style="font-family:Noto Sans SC,sans-serif;font-size:24px;font-weight:500;color:var(--ink);line-height:1.6;margin:12px 0">' +
    q.sentence +
    '</div><div class="quiz-q-pinyin" style="font-size:13px">' +
    q.hint +
    '</div></div><div class="quiz-options">' +
    optHtml +
    "</div></div>"
  );
}
function genR4Fill() {
  const pool = HSK4_ALL.filter((w) => wEx(w) && wEx(w).length > 3);
  const all = HSK4_ALL;
  const words = shuffle(pool).slice(0, 20);
  state.quizQuestions = words.map((w) => {
    let ex = wEx(w);
    let idx = ex.indexOf("(");
    let cn =
      idx > 0
        ? ex.substring(0, idx).trim()
        : ex.split("；")[0].split(";")[0];
    let vi = idx > 0 ? ex.substring(idx) : wVi(w);
    let blank = cn.replace(wHz(w), "______");
    if (blank === cn) {
      for (let i = 0; i < wHz(w).length; i++) {
        let ch = wHz(w).charAt(i);
        if (cn.indexOf(ch) >= 0) {
          blank = cn.replace(ch, "__");
          break;
        }
      }
    }
    let wr = shuffle(
      all.filter((x) => wHz(x) !== wHz(w)).map((x) => wHz(x)),
    ).slice(0, 3);
    let opts = shuffle([wHz(w), ...wr]);
    return {
      sentence: blank,
      hint: vi || wVi(w),
      ci: opts.indexOf(wHz(w)),
      options: opts,
      sel: -1,
    };
  });
  state.quizIndex = 0;
  state.quizScore = 0;
  state.quizAnswered = false;
  state.quizDone = false;
}

function getGrammarAdvData() {
  if (state.level === "hsk4")
    return { data: GRAMMAR_HSK4, num: "4", color: "#2980B9" };
  if (state.level === "hsk5")
    return { data: GRAMMAR_HSK5, num: "5", color: "#1ABC9C" };
  if (state.level === "hsk6")
    return { data: GRAMMAR_HSK6, num: "6", color: "#F39C12" };
  return { data: GRAMMAR_HSK79G, num: "7-9", color: "#8E44AD" };
}
function renderGrammarAdv() {
  const g = getGrammarAdvData();
  let curGroup = "";
  let items = g.data
    .map((p, i) => {
      let groupHeader = "";
      if (p.gr !== curGroup) {
        curGroup = p.gr;
        groupHeader =
          '<div style="grid-column:1/-1;padding:14px 0 6px;font-size:16px;font-weight:700;color:' +
          g.color +
          ";border-bottom:2px solid " +
          g.color +
          "30;margin-top:" +
          (i > 0 ? "20px" : "0") +
          '">' +
          p.gr +
          "</div>";
      }
      let exHtml = p.eg
        ? p.eg
            .map(
              (e) =>
                '<div style="padding:5px 0;border-bottom:1px dotted #eee;line-height:1.7">' +
                e +
                "</div>",
            )
            .join("")
        : "";
      let pyHtml = p.py
        ? '<div style="font-size:14px;color:#999;margin-bottom:6px;font-style:italic">' +
          p.py +
          "</div>"
        : "";
      return (
        groupHeader +
        '<div class="word-item" style="grid-template-columns:1fr;padding:18px 20px"><div class="word-info"><div style="font-size:12px;color:' +
        g.color +
        ';font-weight:600;margin-bottom:4px;text-transform:uppercase;letter-spacing:0.5px">' +
        p.cat +
        '</div><div style="font-family:Noto Sans SC,sans-serif;font-size:20px;font-weight:700;color:var(--ink);margin-bottom:2px">' +
        p.cn +
        "</div>" +
        pyHtml +
        '<div style="font-size:14px;color:var(--ink-light);margin-bottom:10px">' +
        p.vi +
        '</div><div style="background:#f8f5f0;border-radius:10px;padding:10px 14px;font-size:13px;color:#555;font-family:Noto Sans SC,sans-serif">' +
        exHtml +
        "</div></div></div>"
      );
    })
    .join("");
  return (
    '<div class="fade-in"><button class="back-btn" data-action="back-grammarAdv">← Quay lại</button><div class="lesson-view-title">📖 Ngữ pháp HSK ' +
    g.num +
    '</div><div class="lesson-view-sub">' +
    g.data.length +
    ' điểm ngữ pháp · Có giải thích + ví dụ</div><div class="word-list">' +
    items +
    "</div></div>"
  );
}

function getHSK456Data() {
  if (state.level === "hsk5")
    return { all: HSK5_ALL, num: "5", color: "#1ABC9C", bg: "#E8F6F3" };
  return { all: HSK6_ALL, num: "6", color: "#F39C12", bg: "#FEF5E7" };
}
function getHSK456Sets() {
  const d = getHSK456Data();
  const sets = [];
  const sz = 20;
  for (let i = 0; i < d.all.length; i += sz) {
    const id = Math.floor(i / sz) + 1;
    sets.push({
      id,
      words: d.all.slice(i, i + sz),
      start: i + 1,
      end: Math.min(i + sz, d.all.length),
    });
  }
  return sets;
}
function renderHSK456Level() {
  const d = getHSK456Data();
  const sets = getHSK456Sets();
  const gData = {
    hsk5: GRAMMAR_HSK5,
    hsk6: GRAMMAR_HSK6,
  }[state.level];
  let grammarCard456 = gData
    ? '<div class="lesson-card" style="border:2px dashed ' +
      d.color +
      ';background:linear-gradient(135deg,#FAFAFA,#F5F5F5);cursor:pointer" data-action="open-grammarAdv" data-glv="' +
      state.level +
      '"><div class="lesson-num" style="color:' +
      d.color +
      '">📖 Ngữ pháp HSK ' +
      d.num +
      '</div><div class="lesson-title-cn" style="font-size:18px">' +
      gData.length +
      ' điểm ngữ pháp</div><div class="lesson-title-vi">Phân loại theo nhóm</div></div>'
    : "";
  let cards = sets
    .map(
      (s) =>
        '<div class="lesson-card" style="border-left:3px solid ' +
        d.color +
        '" data-hsk456set="' +
        s.id +
        '"><div class="lesson-num" style="color:' +
        d.color +
        '">Mục ' +
        s.id +
        '</div><div class="lesson-title-cn" style="font-size:17px">Từ ' +
        s.start +
        " – " +
        s.end +
        '</div><div class="lesson-title-vi" style="font-size:12px">' +
        s.words
          .slice(0, 5)
          .map((w) => w.h)
          .join(" · ") +
        '…</div><div class="lesson-meta"><span class="lesson-tag" style="background:' +
        d.bg +
        ";color:" +
        d.color +
        '">' +
        s.words.length +
        " từ</span></div></div>",
    )
    .join("");
  return (
    '<div class="fade-in"><div style="text-align:center;padding:30px 20px 24px"><div class="section-title" style="justify-content:center;border:none;margin:0 0 8px"><span class="badge" style="background:' +
    d.color +
    '">HSK ' +
    d.num +
    '</span> <span style="font-family:Noto Serif SC,serif">Từ vựng HSK ' +
    d.num +
    '</span></div><p style="font-size:14px;color:var(--ink-light)">' +
    d.all.length +
    " từ · " +
    sets.length +
    ' mục · Mỗi mục 20 từ</p></div><div class="lesson-grid">' +
    grammarCard456 +
    cards +
    "</div></div>"
  );
}
function renderHSK456Set() {
  const d = getHSK456Data();
  const sets = getHSK456Sets();
  const s = sets.find((x) => x.id === state.lessonId);
  if (!s) return "";
  return (
    '<div class="fade-in"><button class="back-btn" data-action="back-456">← Quay lại</button><div class="lesson-view-title" style="font-size:26px">HSK ' +
    d.num +
    " · Mục " +
    s.id +
    ' <span style="font-size:16px;color:var(--ink-light)">(từ ' +
    s.start +
    "–" +
    s.end +
    ')</span></div><div class="lesson-view-sub">' +
    s.words.length +
    ' từ vựng</div><div class="mode-tabs"><button class="mode-tab ' +
    (state.mode === "list" ? "active" : "") +
    '" data-m456="list">📋 Danh sách</button><button class="mode-tab ' +
    (state.mode === "flashcard" ? "active" : "") +
    '" data-m456="flashcard">🃏 Lật thẻ</button><button class="mode-tab ' +
    (state.mode === "meaning" ? "active" : "") +
    '" data-m456="meaning">✏️ Chọn nghĩa</button><button class="mode-tab ' +
    (state.mode === "fillin" ? "active" : "") +
    '" data-m456="fillin">📝 Điền từ</button></div>' +
    (state.mode === "list" ? r456List(s, d) : "") +
    (state.mode === "flashcard" ? r456FC(s, d) : "") +
    (state.mode === "meaning" ? r456Quiz(s, d) : "") +
    (state.mode === "fillin" ? r456Fill(s, d) : "") +
    "</div>"
  );
}
function r456List(s, d) {
  return (
    '<div class="word-list">' +
    s.words
      .map(
        (w) =>
          '<div class="word-item"><button class="audio-btn" data-speak="' +
          w.h +
          '">🔊</button><div class="word-hanzi">' +
          w.h +
          '</div><div class="word-info"><div class="word-pinyin">' +
          w.p +
          ' <span style="color:var(--gold);font-size:12px">' +
          w.hv +
          '</span></div><div class="word-meaning">' +
          w.vi +
          '</div><div style="font-size:12px;color:#999;margin-top:3px">' +
          w.ex +
          '</div></div><div class="word-pos">' +
          w.ps +
          "</div></div>",
      )
      .join("") +
    "</div>"
  );
}
function r456FC(s, d) {
  if (!state.fcShuffled.length || !state.fcShuffled[0].hv) {
    state.fcShuffled = shuffle(s.words);
    state.fcIndex = 0;
    state.fcFlipped = false;
  }
  const w = state.fcShuffled[state.fcIndex];
  return (
    '<div class="flashcard-container"><div class="flashcard-progress">' +
    (state.fcIndex + 1) +
    " / " +
    state.fcShuffled.length +
    '</div><div class="flashcard" data-action="flip"><div class="flashcard-inner ' +
    (state.fcFlipped ? "flipped" : "") +
    '"><div class="flashcard-front"><div class="fc-hanzi">' +
    w.h +
    '</div><button class="audio-btn" data-speak="' +
    w.h +
    '" style="font-size:28px;opacity:0.7;margin:8px 0" onclick="event.stopPropagation()">🔊</button><div class="fc-hint">Nhấn hoặc Space để lật · ← → chuyển từ</div></div><div class="flashcard-back"><div class="fc-pinyin">' +
    w.p +
    '</div><div style="font-size:14px;color:rgba(255,255,255,0.6);margin-bottom:10px">' +
    w.hv +
    '</div><div class="fc-meaning">' +
    w.vi +
    '</div><div style="font-size:13px;color:rgba(255,255,255,0.5);margin-top:12px;line-height:1.5">' +
    w.ex +
    '</div></div></div></div><div class="fc-controls"><button class="fc-btn prev" data-action="fc-prev" ' +
    (state.fcIndex === 0 ? "disabled" : "") +
    '>← Trước</button><button class="shuffle-btn" data-action="fc-shuffle-456">🔀</button><button class="fc-btn next" data-action="fc-next" ' +
    (state.fcIndex >= state.fcShuffled.length - 1 ? "disabled" : "") +
    ">Tiếp →</button></div></div>"
  );
}
function r456Quiz(s, d) {
  if (
    !state.quizQuestions.length ||
    state.rQuizType !== "456_m_" + d.num + "_" + s.id
  ) {
    state.rQuizType = "456_m_" + d.num + "_" + s.id;
    gen456Quiz(s, d);
  }
  if (state.quizDone) {
    const t = state.quizQuestions.length,
      p = Math.round((state.quizScore / t) * 100);
    let m =
      p >= 90
        ? "🎉 Xuất sắc!"
        : p >= 70
          ? "👍 Khá tốt!"
          : p >= 50
            ? "💪 Cần ôn thêm!"
            : "📚 Hãy ôn lại nhé!";
    return (
      '<div class="quiz-result fade-in"><div class="quiz-score">' +
      state.quizScore +
      "/" +
      t +
      '</div><div class="quiz-score-label">' +
      m +
      " Đúng " +
      p +
      '%</div><button class="quiz-restart" data-action="quiz-restart-456">Làm lại</button></div>'
    );
  }
  const q = state.quizQuestions[state.quizIndex],
    pr = (state.quizIndex / state.quizQuestions.length) * 100;
  let optHtml = q.options
    .map((o, i) => {
      let c = "";
      if (state.quizAnswered) {
        if (i === q.ci) c = "correct";
        else if (i === q.sel) c = "wrong";
      }
      return (
        '<button class="quiz-option ' +
        c +
        '" data-quiz-opt="' +
        i +
        '" ' +
        (state.quizAnswered ? "disabled" : "") +
        ' style="' +
        (q.isCn
          ? "font-family:Noto Sans SC,sans-serif;font-size:20px"
          : "") +
        '">' +
        o +
        "</button>"
      );
    })
    .join("");
  return (
    '<div class="quiz-container fade-in"><div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:' +
    pr +
    '%"></div></div><div class="quiz-question"><div class="quiz-q-label">Câu ' +
    (state.quizIndex + 1) +
    "/" +
    state.quizQuestions.length +
    '</div><div class="quiz-q-hanzi">' +
    q.prompt +
    '</div><div class="quiz-q-pinyin">' +
    q.sub +
    '</div></div><div class="quiz-options">' +
    optHtml +
    "</div></div>"
  );
}
function gen456Quiz(s, d) {
  const words = shuffle(s.words);
  const pool = d.all;
  state.quizQuestions = words.map((w) => {
    const cn = Math.random() < 0.5;
    if (cn) {
      let wr = shuffle(
        pool.filter((x) => x.vi !== w.vi).map((x) => x.vi),
      ).slice(0, 3);
      let opts = shuffle([w.vi, ...wr]);
      return {
        prompt: w.h,
        sub: w.p,
        ci: opts.indexOf(w.vi),
        options: opts,
        sel: -1,
        isCn: false,
      };
    } else {
      let wr = shuffle(
        pool.filter((x) => x.h !== w.h).map((x) => x.h),
      ).slice(0, 3);
      let opts = shuffle([w.h, ...wr]);
      return {
        prompt: w.vi,
        sub: "Chọn từ tiếng Trung đúng",
        ci: opts.indexOf(w.h),
        options: opts,
        sel: -1,
        isCn: true,
      };
    }
  });
  state.quizIndex = 0;
  state.quizScore = 0;
  state.quizAnswered = false;
  state.quizDone = false;
}
function r456Fill(s, d) {
  if (
    !state.quizQuestions.length ||
    state.rQuizType !== "456_f_" + d.num + "_" + s.id
  ) {
    state.rQuizType = "456_f_" + d.num + "_" + s.id;
    gen456Fill(s, d);
  }
  if (state.quizDone) {
    const t = state.quizQuestions.length,
      p = Math.round((state.quizScore / t) * 100);
    let m =
      p >= 90
        ? "🎉 Xuất sắc!"
        : p >= 70
          ? "👍 Khá tốt!"
          : p >= 50
            ? "💪 Cần ôn thêm!"
            : "📚 Hãy ôn lại nhé!";
    return (
      '<div class="quiz-result fade-in"><div class="quiz-score">' +
      state.quizScore +
      "/" +
      t +
      '</div><div class="quiz-score-label">' +
      m +
      " Đúng " +
      p +
      '%</div><button class="quiz-restart" data-action="quiz-restart-456">Làm lại</button></div>'
    );
  }
  const q = state.quizQuestions[state.quizIndex],
    pr = (state.quizIndex / state.quizQuestions.length) * 100;
  let optHtml = q.options
    .map((o, i) => {
      let c = "";
      if (state.quizAnswered) {
        if (i === q.ci) c = "correct";
        else if (i === q.sel) c = "wrong";
      }
      return (
        '<button class="quiz-option ' +
        c +
        '" data-quiz-opt="' +
        i +
        '" ' +
        (state.quizAnswered ? "disabled" : "") +
        ">" +
        o +
        "</button>"
      );
    })
    .join("");
  return (
    '<div class="quiz-container fade-in"><div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:' +
    pr +
    '%"></div></div><div class="quiz-question"><div class="quiz-q-label">Câu ' +
    (state.quizIndex + 1) +
    "/" +
    state.quizQuestions.length +
    ' — Điền từ vào chỗ trống</div><div style="font-family:Noto Sans SC,sans-serif;font-size:24px;font-weight:500;color:var(--ink);line-height:1.6;margin:12px 0">' +
    q.sentence +
    '</div><div class="quiz-q-pinyin" style="font-size:13px">' +
    q.hint +
    '</div></div><div class="quiz-options">' +
    optHtml +
    "</div></div>"
  );
}
function gen456Fill(s, d) {
  const pool = s.words.filter((w) => w.ex && w.ex.length > 3);
  const all = d.all;
  const words = shuffle(pool).slice(0, Math.min(20, pool.length));
  state.quizQuestions = words.map((w) => {
    let ex = w.ex;
    let idx = ex.indexOf("(");
    let cn =
      idx > 0
        ? ex.substring(0, idx).trim()
        : ex.split("；")[0].split(";")[0].split("/")[0].split(" / ")[0];
    let vi = idx > 0 ? ex.substring(idx) : w.vi;
    let blank = cn.replace(w.h, "______");
    if (blank === cn) {
      for (let i = 0; i < w.h.length; i++) {
        let ch = w.h.charAt(i);
        if (cn.indexOf(ch) >= 0) {
          blank = cn.replace(ch, "__");
          break;
        }
      }
    }
    let wr = shuffle(
      all.filter((x) => x.h !== w.h).map((x) => x.h),
    ).slice(0, 3);
    let opts = shuffle([w.h, ...wr]);
    return {
      sentence: blank,
      hint: vi || w.vi,
      ci: opts.indexOf(w.h),
      options: opts,
      sel: -1,
    };
  });
  state.quizIndex = 0;
  state.quizScore = 0;
  state.quizAnswered = false;
  state.quizDone = false;
}

function renderHomeGrammar() {
  const levels = [
    { data: GRAMMAR_HSK1, num: "1", color: "#C0392B", lv: "hsk1" },
    { data: GRAMMAR_HSK2, num: "2", color: "#E67E22", lv: "hsk2" },
    { data: GRAMMAR_HSK3, num: "3", color: "#27AE60", lv: "hsk3" },
  ];
  let cards = "";
  levels.forEach((d) => {
    const lessons = Object.keys(d.data)
      .map(Number)
      .sort((a, b) => a - b);
    const total = lessons.reduce((s, l) => s + d.data[l].length, 0);
    cards +=
      '<div class="lesson-card" style="border-left:3px solid ' +
      d.color +
      ';cursor:pointer" data-action="open-grammar" data-glv="' +
      d.lv +
      '"><div class="lesson-num" style="color:' +
      d.color +
      '">HSK ' +
      d.num +
      '</div><div class="lesson-title-cn" style="font-size:18px">Ngữ pháp HSK ' +
      d.num +
      '</div><div class="lesson-title-vi">' +
      total +
      " điểm · " +
      lessons.length +
      " bài</div></div>";
  });
  const totalAll =
    Object.values(GRAMMAR_HSK1).flat().length +
    Object.values(GRAMMAR_HSK2).flat().length +
    Object.values(GRAMMAR_HSK3).flat().length;
  return (
    '<div class="section-title"><span class="badge" style="background:#E74C3C">📖</span> Ôn tập ngữ pháp <span style="font-size:13px;color:var(--ink-light);font-family:Be Vietnam Pro;font-weight:400">· ' +
    totalAll +
    ' điểm ngữ pháp</span></div><div class="lesson-grid fade-in">' +
    cards +
    "</div>"
  );
}
function _old_renderHomeGrammar_unused() {
  return (
    '<div class="section-title"><span class="badge" style="background:#E74C3C">📖</span> Ôn tập ngữ pháp <span style="font-size:13px;color:var(--ink-light);font-family:Be Vietnam Pro;font-weight:400">· ' +
    GRAMMAR_HSK1.length +
    " + " +
    GRAMMAR_HSK2.length +
    " + " +
    GRAMMAR_HSK3.length +
    ' điểm ngữ pháp</span></div><div class="lesson-grid fade-in"><div class="lesson-card" style="border-left:3px solid #C0392B;cursor:pointer" data-action="open-grammar" data-glv="hsk1"><div class="lesson-num" style="color:#C0392B">HSK 1</div><div class="lesson-title-cn" style="font-size:18px">Ngữ pháp HSK 1</div><div class="lesson-title-vi">' +
    GRAMMAR_HSK1.length +
    ' điểm ngữ pháp cơ bản</div></div><div class="lesson-card" style="border-left:3px solid #E67E22;cursor:pointer" data-action="open-grammar" data-glv="hsk2"><div class="lesson-num" style="color:#E67E22">HSK 2</div><div class="lesson-title-cn" style="font-size:18px">Ngữ pháp HSK 2</div><div class="lesson-title-vi">' +
    GRAMMAR_HSK2.length +
    ' điểm ngữ pháp</div></div><div class="lesson-card" style="border-left:3px solid #27AE60;cursor:pointer" data-action="open-grammar" data-glv="hsk3"><div class="lesson-num" style="color:#27AE60">HSK 3</div><div class="lesson-title-cn" style="font-size:18px">Ngữ pháp HSK 3</div><div class="lesson-title-vi">' +
    GRAMMAR_HSK3.length +
    " điểm ngữ pháp</div></div></div>"
  );
}

function getGrammarData() {
  if (state.level === "hsk1")
    return { data: GRAMMAR_HSK1, num: "1", color: "#C0392B" };
  if (state.level === "hsk2")
    return { data: GRAMMAR_HSK2, num: "2", color: "#E67E22" };
  return { data: GRAMMAR_HSK3, num: "3", color: "#27AE60" };
}
function getGrammarFlat() {
  const g = getGrammarData();
  return Object.values(g.data).flat();
}
function _old_getGrammarData_unused() {
  if (state.level === "hsk1")
    return { data: GRAMMAR_HSK1, num: "1", color: "#C0392B" };
  if (state.level === "hsk2")
    return { data: GRAMMAR_HSK2, num: "2", color: "#E67E22" };
  return { data: GRAMMAR_HSK3, num: "3", color: "#27AE60" };
}

function renderGrammar() {
  const g = getGrammarData();
  if (state.lessonId) {
    const points = g.data[state.lessonId] || [];
    return (
      '<div class="fade-in"><button class="back-btn" data-action="back-grammar-lesson">← Quay lại</button><div class="lesson-view-title">📖 Ngữ pháp HSK ' +
      g.num +
      " · Bài " +
      state.lessonId +
      '</div><div class="lesson-view-sub">' +
      points.length +
      " điểm ngữ pháp</div>" +
      grList({ data: points, color: g.color }) +
      "</div>"
    );
  }
  const lessons = Object.keys(g.data)
    .map(Number)
    .sort((a, b) => a - b);
  let cards = lessons
    .map(
      (l) =>
        '<div class="lesson-card" style="border-left:3px solid ' +
        g.color +
        ';cursor:pointer" data-grammar-lesson="' +
        l +
        '"><div class="lesson-num" style="color:' +
        g.color +
        '">Bài ' +
        l +
        '</div><div class="lesson-title-cn" style="font-size:16px">' +
        g.data[l].map((p) => p.cn).join(" · ") +
        '</div><div class="lesson-title-vi">' +
        g.data[l].length +
        " điểm ngữ pháp</div></div>",
    )
    .join("");
  return (
    '<div class="fade-in"><button class="back-btn" data-action="back-grammar">← Quay lại</button><div class="lesson-view-title">📖 Ngữ pháp HSK ' +
    g.num +
    '</div><div class="lesson-view-sub">' +
    getGrammarFlat().length +
    " điểm · " +
    lessons.length +
    ' bài</div><div class="lesson-grid">' +
    cards +
    "</div></div>"
  );
}
function _old_renderGrammar_unused() {
  const g = getGrammarData();
  return (
    '<div class="fade-in"><button class="back-btn" data-action="back-grammar">← Quay lại</button><div class="lesson-view-title">📖 Ngữ pháp HSK ' +
    g.num +
    '</div><div class="lesson-view-sub">' +
    g.data.length +
    ' điểm ngữ pháp</div><div class="mode-tabs"><button class="mode-tab ' +
    (state.mode === "list" ? "active" : "") +
    '" data-mgr="list">📋 Danh sách</button><button class="mode-tab ' +
    (state.mode === "flashcard" ? "active" : "") +
    '" data-mgr="flashcard">🃏 Lật thẻ</button><button class="mode-tab ' +
    (state.mode === "meaning" ? "active" : "") +
    '" data-mgr="meaning">✏️ Trắc nghiệm</button></div>' +
    (state.mode === "list" ? grList(g) : "") +
    (state.mode === "flashcard" ? grFC(g) : "") +
    (state.mode === "meaning" ? grQuiz(g) : "") +
    "</div>"
  );
}

function grList(g) {
  let pts = g.data;
  let items = pts
    .map((p, i) => {
      let pyHtml = p.py
        ? '<div style="font-size:13px;color:#999;font-style:italic;margin-bottom:4px">' +
          p.py +
          "</div>"
        : "";
      let egHtml = "";
      if (Array.isArray(p.eg)) {
        egHtml = p.eg
          .map(
            (e) =>
              '<div style="padding:5px 0;border-bottom:1px dotted #eee;line-height:1.7">' +
              e +
              "</div>",
          )
          .join("");
      } else if (p.eg) {
        egHtml = '<div style="line-height:1.7">' + p.eg + "</div>";
      }
      return (
        '<div class="word-item" style="grid-template-columns:auto 1fr"><div style="min-width:36px;text-align:center;font-weight:700;color:' +
        (g.color || "var(--red)") +
        ';font-size:16px">' +
        (i + 1) +
        '</div><div class="word-info"><div style="font-family:Noto Sans SC,sans-serif;font-size:18px;font-weight:700;color:var(--ink);margin-bottom:2px">' +
        p.cn +
        "</div>" +
        pyHtml +
        '<div style="font-size:14px;color:' +
        (g.color || "var(--red)") +
        ';font-weight:600;margin-bottom:4px">' +
        p.vi +
        '</div><div style="font-size:13px;color:var(--ink-light);margin-bottom:8px">' +
        p.ex +
        '</div><div style="background:#f8f5f0;border-radius:10px;padding:10px 14px;font-size:13px;color:#555;font-family:Noto Sans SC,sans-serif">' +
        egHtml +
        "</div></div></div>"
      );
    })
    .join("");
  return '<div class="word-list">' + items + "</div>";
}
function _old_grList_unused(g) {
  let items = g.data
    .map(
      (p, i) =>
        '<div class="word-item" style="grid-template-columns:auto 1fr"><div style="min-width:36px;text-align:center;font-weight:700;color:' +
        g.color +
        ';font-size:16px">' +
        (i + 1) +
        '</div><div class="word-info"><div style="font-family:Noto Sans SC,sans-serif;font-size:18px;font-weight:700;color:var(--ink);margin-bottom:4px">' +
        p.cn +
        '</div><div style="font-size:14px;color:' +
        g.color +
        ';font-weight:600;margin-bottom:4px">' +
        p.vi +
        '</div><div style="font-size:13px;color:var(--ink-light);margin-bottom:6px">' +
        p.ex +
        '</div><div style="font-size:13px;color:#888;background:#f8f5f0;padding:8px 12px;border-radius:8px;line-height:1.6;font-family:Noto Sans SC,sans-serif">' +
        p.eg +
        "</div></div></div>",
    )
    .join("");
  return '<div class="word-list">' + items + "</div>";
}

function grFC(g) {
  if (!state.fcShuffled.length || !state.fcShuffled[0].cn) {
    state.fcShuffled = shuffle(g.data);
    state.fcIndex = 0;
    state.fcFlipped = false;
  }
  const p = state.fcShuffled[state.fcIndex];
  return (
    '<div class="flashcard-container"><div class="flashcard-progress">' +
    (state.fcIndex + 1) +
    " / " +
    state.fcShuffled.length +
    '</div><div class="flashcard" data-action="flip"><div class="flashcard-inner ' +
    (state.fcFlipped ? "flipped" : "") +
    '"><div class="flashcard-front"><div class="fc-hanzi" style="font-size:36px">' +
    p.cn +
    '</div><div class="fc-hint">Nhấn hoặc Space để lật</div></div><div class="flashcard-back"><div class="fc-pinyin" style="font-size:22px">' +
    p.vi +
    '</div><div class="fc-meaning" style="font-size:15px">' +
    p.ex +
    '</div><div style="font-size:14px;color:rgba(255,255,255,0.6);margin-top:14px;line-height:1.6">' +
    p.eg +
    '</div></div></div></div><div class="fc-controls"><button class="fc-btn prev" data-action="fc-prev" ' +
    (state.fcIndex === 0 ? "disabled" : "") +
    '>← Trước</button><button class="shuffle-btn" data-action="fc-shuffle-gr">🔀</button><button class="fc-btn next" data-action="fc-next" ' +
    (state.fcIndex >= state.fcShuffled.length - 1 ? "disabled" : "") +
    ">Tiếp →</button></div></div>"
  );
}
function _old_grFC_unused(g) {
  if (!state.fcShuffled.length || !state.fcShuffled[0].cn) {
    state.fcShuffled = shuffle(g.data);
    state.fcIndex = 0;
    state.fcFlipped = false;
  }
  const p = state.fcShuffled[state.fcIndex];
  return (
    '<div class="flashcard-container"><div class="flashcard-progress">' +
    (state.fcIndex + 1) +
    " / " +
    state.fcShuffled.length +
    '</div><div class="flashcard" data-action="flip"><div class="flashcard-inner ' +
    (state.fcFlipped ? "flipped" : "") +
    '"><div class="flashcard-front"><div class="fc-hanzi" style="font-size:36px">' +
    p.cn +
    '</div><div class="fc-hint">Nhấn hoặc Space để lật · ← → chuyển</div></div><div class="flashcard-back"><div class="fc-pinyin" style="font-size:22px">' +
    p.vi +
    '</div><div class="fc-meaning" style="font-size:15px">' +
    p.ex +
    '</div><div style="font-size:14px;color:rgba(255,255,255,0.6);margin-top:14px;line-height:1.6">' +
    p.eg +
    '</div></div></div></div><div class="fc-controls"><button class="fc-btn prev" data-action="fc-prev" ' +
    (state.fcIndex === 0 ? "disabled" : "") +
    '>← Trước</button><button class="shuffle-btn" data-action="fc-shuffle-gr">🔀</button><button class="fc-btn next" data-action="fc-next" ' +
    (state.fcIndex >= state.fcShuffled.length - 1 ? "disabled" : "") +
    ">Tiếp →</button></div></div>"
  );
}

function grQuiz(g) {
  if (
    !state.quizQuestions.length ||
    state.rQuizType !== "gr_" + g.num + "_" + (state.lessonId || "all")
  ) {
    state.rQuizType = "gr_" + g.num + "_" + (state.lessonId || "all");
    genGrQuiz(g);
  }
  if (state.quizDone) {
    const t = state.quizQuestions.length,
      p = Math.round((state.quizScore / t) * 100);
    let m =
      p >= 90
        ? "🎉 Xuất sắc!"
        : p >= 70
          ? "👍 Khá tốt!"
          : p >= 50
            ? "💪 Cần ôn thêm!"
            : "📚 Hãy ôn lại nhé!";
    return (
      '<div class="quiz-result fade-in"><div class="quiz-score">' +
      state.quizScore +
      "/" +
      t +
      '</div><div class="quiz-score-label">' +
      m +
      " Đúng " +
      p +
      '%</div><button class="quiz-restart" data-action="quiz-restart-gr">Làm lại</button></div>'
    );
  }
  const q = state.quizQuestions[state.quizIndex],
    pr = (state.quizIndex / state.quizQuestions.length) * 100;
  let optHtml = q.options
    .map((o, i) => {
      let c = "";
      if (state.quizAnswered) {
        if (i === q.ci) c = "correct";
        else if (i === q.sel) c = "wrong";
      }
      return (
        '<button class="quiz-option ' +
        c +
        '" data-quiz-opt="' +
        i +
        '" ' +
        (state.quizAnswered ? "disabled" : "") +
        ">" +
        o +
        "</button>"
      );
    })
    .join("");
  return (
    '<div class="quiz-container fade-in"><div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:' +
    pr +
    '%"></div></div><div class="quiz-question"><div class="quiz-q-label">Câu ' +
    (state.quizIndex + 1) +
    "/" +
    state.quizQuestions.length +
    '</div><div style="font-family:Noto Sans SC,sans-serif;font-size:22px;font-weight:600;margin:12px 0;color:var(--ink)">' +
    q.prompt +
    '</div><div class="quiz-q-pinyin" style="font-size:13px">' +
    q.sub +
    '</div></div><div class="quiz-options">' +
    optHtml +
    "</div></div>"
  );
}
function _old_grQuiz_unused(g) {
  if (!state.quizQuestions.length || state.rQuizType !== "gr_" + g.num) {
    state.rQuizType = "gr_" + g.num;
    genGrQuiz(g);
  }
  if (state.quizDone) {
    const t = state.quizQuestions.length,
      p = Math.round((state.quizScore / t) * 100);
    let m =
      p >= 90
        ? "🎉 Xuất sắc!"
        : p >= 70
          ? "👍 Khá tốt!"
          : p >= 50
            ? "💪 Cần ôn thêm!"
            : "📚 Hãy ôn lại nhé!";
    return (
      '<div class="quiz-result fade-in"><div class="quiz-score">' +
      state.quizScore +
      "/" +
      t +
      '</div><div class="quiz-score-label">' +
      m +
      " Đúng " +
      p +
      '%</div><button class="quiz-restart" data-action="quiz-restart-gr">Làm lại</button></div>'
    );
  }
  const q = state.quizQuestions[state.quizIndex],
    pr = (state.quizIndex / state.quizQuestions.length) * 100;
  let optHtml = q.options
    .map((o, i) => {
      let c = "";
      if (state.quizAnswered) {
        if (i === q.ci) c = "correct";
        else if (i === q.sel) c = "wrong";
      }
      return (
        '<button class="quiz-option ' +
        c +
        '" data-quiz-opt="' +
        i +
        '" ' +
        (state.quizAnswered ? "disabled" : "") +
        ">" +
        o +
        "</button>"
      );
    })
    .join("");
  return (
    '<div class="quiz-container fade-in"><div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:' +
    pr +
    '%"></div></div><div class="quiz-question"><div class="quiz-q-label">Câu ' +
    (state.quizIndex + 1) +
    "/" +
    state.quizQuestions.length +
    '</div><div style="font-family:Noto Sans SC,sans-serif;font-size:22px;font-weight:600;margin:12px 0;color:var(--ink)">' +
    q.prompt +
    '</div><div class="quiz-q-pinyin" style="font-size:13px">' +
    q.sub +
    '</div></div><div class="quiz-options">' +
    optHtml +
    "</div></div>"
  );
}

function genGrQuiz(g) {
  const all = g.data;
  const items = shuffle(all);
  state.quizQuestions = items.map((p) => {
    const showCn = Math.random() < 0.5;
    if (showCn) {
      let wr = shuffle(
        all.filter((x) => x.vi !== p.vi).map((x) => x.vi),
      ).slice(0, 3);
      let opts = shuffle([p.vi, ...wr]);
      return {
        prompt: p.cn,
        sub: p.eg,
        ci: opts.indexOf(p.vi),
        options: opts,
        sel: -1,
      };
    } else {
      let wr = shuffle(
        all.filter((x) => x.cn !== p.cn).map((x) => x.cn),
      ).slice(0, 3);
      let opts = shuffle([p.cn, ...wr]);
      return {
        prompt: p.vi,
        sub: p.ex,
        ci: opts.indexOf(p.cn),
        options: opts,
        sel: -1,
      };
    }
  });
  state.quizIndex = 0;
  state.quizScore = 0;
  state.quizAnswered = false;
  state.quizDone = false;
}
function _old_genGrQuiz_unused(g) {
  const all = g.data;
  const items = shuffle(all);
  state.quizQuestions = items.map((p) => {
    const showCn = Math.random() < 0.5;
    if (showCn) {
      let wr = shuffle(
        all.filter((x) => x.vi !== p.vi).map((x) => x.vi),
      ).slice(0, 3);
      let opts = shuffle([p.vi, ...wr]);
      return {
        prompt: p.cn,
        sub: p.eg,
        ci: opts.indexOf(p.vi),
        options: opts,
        sel: -1,
      };
    } else {
      let wr = shuffle(
        all.filter((x) => x.cn !== p.cn).map((x) => x.cn),
      ).slice(0, 3);
      let opts = shuffle([p.cn, ...wr]);
      return {
        prompt: p.vi,
        sub: p.ex,
        ci: opts.indexOf(p.cn),
        options: opts,
        sel: -1,
      };
    }
  });
  state.quizIndex = 0;
  state.quizScore = 0;
  state.quizAnswered = false;
  state.quizDone = false;
}

function renderHSK3Level() {
  let grammarCard3 = "";
  if (typeof GRAMMAR_HSK3 !== "undefined") {
    const gt = Object.values(GRAMMAR_HSK3).flat().length;
    grammarCard3 =
      '<div class="lesson-card" style="border:2px dashed #27AE60;background:linear-gradient(135deg,#F0FFF8,#E8FFF0)" data-action="open-grammar" data-glv="hsk3"><div class="lesson-num" style="color:#27AE60">📖 Ngữ pháp HSK 3</div><div class="lesson-title-cn" style="font-size:18px">' +
      gt +
      ' điểm ngữ pháp</div><div class="lesson-title-vi">Lý thuyết + Ví dụ theo từng bài</div></div>';
  }
  let reviewCard3 =
    '<div class="lesson-card review-card hsk3" data-action="open-review3"><div class="lesson-num" style="color:var(--gold)">⭐ Tổng ôn từ vựng</div><div class="lesson-title-cn">500 từ HSK3</div><div class="lesson-title-vi">Flashcard · Trắc nghiệm · Điền từ</div><div class="lesson-meta"><span class="lesson-tag" style="background:#FFF8E0;color:#B8860B">500 từ</span></div></div>';
  let cards = HSK3.map(
    (l) =>
      '<div class="lesson-card hsk3" data-lesson="' +
      l.id +
      '" data-lv="hsk3"><div class="lesson-num" style="color:#27AE60">第' +
      l.id +
      "课 · Bài " +
      l.id +
      '</div><div class="lesson-title-cn">' +
      l.title +
      '</div><div class="lesson-title-vi">' +
      l.titleVi +
      '</div><div class="lesson-meta"><span class="lesson-tag" style="background:#EAFAF1;color:#27AE60">' +
      l.words.length +
      " từ</span></div></div>",
  ).join("");
  return (
    '<div class="fade-in"><div style="text-align:center;padding:30px 20px 24px"><div class="section-title" style="justify-content:center;border:none;margin:0 0 8px"><span class="badge" style="background:#27AE60">HSK 3</span> <span style="font-family:Noto Serif SC,serif">新HSK教程 3</span></div><p style="font-size:14px;color:var(--ink-light)">' +
    getTotal(HSK3) +
    ' từ vựng · 18 bài học</p></div><div class="lesson-grid">' +
    reviewCard3 +
    grammarCard3 +
    cards +
    "</div></div>"
  );
}

function renderHSK4Level() {
  let grammarCard4 =
    '<div class="lesson-card" style="border:2px dashed #2980B9;background:linear-gradient(135deg,#EBF5FB,#E8F4FC);cursor:pointer" data-action="open-grammarAdv" data-glv="hsk4"><div class="lesson-num" style="color:#2980B9">📖 Ngữ pháp HSK 4</div><div class="lesson-title-cn" style="font-size:18px">' +
    GRAMMAR_HSK4.length +
    ' điểm ngữ pháp</div><div class="lesson-title-vi">Phân loại theo nhóm</div></div>';
  let reviewCard4 =
    '<div class="lesson-card review-card" data-action="open-review4"><div class="lesson-num" style="color:var(--gold)">⭐ Tổng ôn từ vựng</div><div class="lesson-title-cn">1000 từ HSK4</div><div class="lesson-title-vi">Flashcard · Trắc nghiệm · Điền từ</div><div class="lesson-meta"><span class="lesson-tag" style="background:#FFF8E0;color:#B8860B">1000 từ</span></div></div>';
  let cards = HSK4.map(
    (l) =>
      '<div class="lesson-card" style="border-left:3px solid #2980B9" data-lesson="' +
      l.id +
      '" data-lv="hsk4"><div class="lesson-num" style="color:#2980B9">第' +
      l.id +
      "课 · Bài " +
      l.id +
      '</div><div class="lesson-title-cn">' +
      l.title +
      '</div><div class="lesson-title-vi">' +
      l.titleVi +
      '</div><div class="lesson-meta"><span class="lesson-tag" style="background:#EBF5FB;color:#2980B9">' +
      l.words.length +
      " từ</span></div></div>",
  ).join("");
  return (
    '<div class="fade-in"><div style="text-align:center;padding:30px 20px 24px"><div class="section-title" style="justify-content:center;border:none;margin:0 0 8px"><span class="badge" style="background:#2980B9">HSK 4</span> <span style="font-family:Noto Serif SC,serif">新HSK教程 4</span></div><p style="font-size:14px;color:var(--ink-light)">' +
    getTotal(HSK4) +
    ' từ vựng · 50 bài học · Mỗi bài 20 từ</p></div><div class="lesson-grid">' +
    reviewCard4 +
    grammarCard4 +
    cards +
    "</div></div>"
  );
}

function renderHSK79Level() {
  const sets = getHSK79Sets();
  let cards = sets
    .map(
      (s) =>
        '<div class="lesson-card hsk79" data-hsk79set="' +
        s.id +
        '"><div class="lesson-num" style="color:#8E44AD">Mục ' +
        s.id +
        '</div><div class="lesson-title-cn" style="font-size:17px">Từ ' +
        s.start +
        " – " +
        s.end +
        '</div><div class="lesson-title-vi" style="font-size:12px">' +
        s.words
          .slice(0, 5)
          .map((w) => w.h)
          .join(" · ") +
        '…</div><div class="lesson-meta"><span class="lesson-tag" style="background:#F4ECF7;color:#8E44AD">' +
        s.words.length +
        " từ</span></div></div>",
    )
    .join("");
  let grammarCard79 =
    '<div class="lesson-card" style="border:2px dashed #8E44AD;background:linear-gradient(135deg,#FAF5FF,#F3EAFF);cursor:pointer" data-action="open-grammarAdv" data-glv="hsk79"><div class="lesson-num" style="color:#8E44AD">📖 Ngữ pháp HSK 7-9</div><div class="lesson-title-cn" style="font-size:18px">' +
    GRAMMAR_HSK79G.length +
    ' điểm ngữ pháp</div><div class="lesson-title-vi">Phân loại theo nhóm</div></div>';
  return (
    '<div class="fade-in"><div style="text-align:center;padding:30px 20px 24px"><div class="section-title" style="justify-content:center;border:none;margin:0 0 8px"><span class="badge" style="background:#8E44AD">HSK 7-9</span> <span style="font-family:Noto Serif SC,serif">Từ vựng nâng cao</span></div><p style="font-size:14px;color:var(--ink-light)">' +
    HSK79_ALL.length +
    " từ · " +
    sets.length +
    ' mục · Mỗi mục 20 từ</p></div><div class="lesson-grid">' +
    cards +
    "</div></div>"
  );
}

function renderHSK79Set() {
  const sets = getHSK79Sets();
  const s = sets.find((x) => x.id === state.lessonId);
  if (!s) return "";
  return (
    '<div class="fade-in"><button class="back-btn" data-action="back-hsk79">← Quay lại</button><div class="lesson-view-title" style="font-size:26px">HSK 7-9 · Mục ' +
    s.id +
    ' <span style="font-size:16px;color:var(--ink-light)">(từ ' +
    s.start +
    "–" +
    s.end +
    ')</span></div><div class="lesson-view-sub">' +
    s.words.length +
    ' từ vựng nâng cao</div><div class="mode-tabs"><button class="mode-tab ' +
    (state.mode === "list" ? "active" : "") +
    '" data-m79="list">📋 Danh sách</button><button class="mode-tab ' +
    (state.mode === "flashcard" ? "active" : "") +
    '" data-m79="flashcard">🃏 Lật thẻ</button><button class="mode-tab ' +
    (state.mode === "meaning" ? "active" : "") +
    '" data-m79="meaning">✏️ Chọn nghĩa</button><button class="mode-tab ' +
    (state.mode === "fillin" ? "active" : "") +
    '" data-m79="fillin">📝 Điền từ</button></div>' +
    (state.mode === "list" ? r79List(s) : "") +
    (state.mode === "flashcard" ? r79FC(s) : "") +
    (state.mode === "meaning" ? r79Quiz(s, state.mode) : "") +
    (state.mode === "fillin" ? r79Fill(s) : "") +
    "</div>"
  );
}

function r79List(s) {
  let items = s.words
    .map(
      (w) =>
        '<div class="word-item"><button class="audio-btn" data-speak="' +
        w.h +
        '">🔊</button><div class="word-hanzi">' +
        w.h +
        '</div><div class="word-info"><div class="word-pinyin">' +
        w.p +
        ' <span style="color:var(--gold);font-size:12px">' +
        w.hv +
        '</span></div><div class="word-meaning">' +
        w.vi +
        '</div><div style="font-size:12px;color:#999;margin-top:3px">' +
        w.ex +
        '</div></div><div class="word-pos">' +
        w.ps +
        "</div></div>",
    )
    .join("");
  return '<div class="word-list">' + items + "</div>";
}

function r79FC(s) {
  if (!state.fcShuffled.length || !state.fcShuffled[0].hv) {
    state.fcShuffled = shuffle(s.words);
    state.fcIndex = 0;
    state.fcFlipped = false;
  }
  const w = state.fcShuffled[state.fcIndex];
  return (
    '<div class="flashcard-container"><div class="flashcard-progress">' +
    (state.fcIndex + 1) +
    " / " +
    state.fcShuffled.length +
    '</div><div class="flashcard" data-action="flip"><div class="flashcard-inner ' +
    (state.fcFlipped ? "flipped" : "") +
    '"><div class="flashcard-front"><div class="fc-hanzi">' +
    w.h +
    '</div><button class="audio-btn" data-speak="' +
    w.h +
    '" style="font-size:28px;opacity:0.7;margin:8px 0" onclick="event.stopPropagation()">🔊</button><div class="fc-hint">Nhấn hoặc Space để lật · ← → chuyển từ</div></div><div class="flashcard-back"><div class="fc-pinyin">' +
    w.p +
    '</div><div style="font-size:14px;color:rgba(255,255,255,0.6);margin-bottom:10px">' +
    w.hv +
    '</div><div class="fc-meaning">' +
    w.vi +
    '</div><div style="font-size:13px;color:rgba(255,255,255,0.5);margin-top:12px;line-height:1.5">' +
    w.ex +
    '</div></div></div></div><div class="fc-controls"><button class="fc-btn prev" data-action="fc-prev" ' +
    (state.fcIndex === 0 ? "disabled" : "") +
    '>← Trước</button><button class="shuffle-btn" data-action="fc-shuffle-79">🔀</button><button class="fc-btn next" data-action="fc-next" ' +
    (state.fcIndex >= state.fcShuffled.length - 1 ? "disabled" : "") +
    ">Tiếp →</button></div></div>"
  );
}

function r79Quiz(s, type) {
  if (
    !state.quizQuestions.length ||
    state.rQuizType !== "79_" + type + "_" + s.id
  ) {
    state.rQuizType = "79_" + type + "_" + s.id;
    gen79Quiz(s, type);
  }
  if (state.quizDone) {
    const t = state.quizQuestions.length,
      p = Math.round((state.quizScore / t) * 100);
    let m =
      p >= 90
        ? "🎉 Xuất sắc!"
        : p >= 70
          ? "👍 Khá tốt!"
          : p >= 50
            ? "💪 Cần ôn thêm!"
            : "📚 Hãy ôn lại nhé!";
    return (
      '<div class="quiz-result fade-in"><div class="quiz-score">' +
      state.quizScore +
      "/" +
      t +
      '</div><div class="quiz-score-label">' +
      m +
      " Đúng " +
      p +
      '%</div><button class="quiz-restart" data-action="quiz-restart-79">Làm lại</button></div>'
    );
  }
  const q = state.quizQuestions[state.quizIndex],
    pr = (state.quizIndex / state.quizQuestions.length) * 100;
  let optHtml = q.options
    .map((o, i) => {
      let c = "";
      if (state.quizAnswered) {
        if (i === q.ci) c = "correct";
        else if (i === q.sel) c = "wrong";
      }
      return (
        '<button class="quiz-option ' +
        c +
        '" data-quiz-opt="' +
        i +
        '" ' +
        (state.quizAnswered ? "disabled" : "") +
        ' style="' +
        (q.isCn
          ? "font-family:Noto Sans SC,sans-serif;font-size:20px"
          : "") +
        '">' +
        o +
        "</button>"
      );
    })
    .join("");
  return (
    '<div class="quiz-container fade-in"><div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:' +
    pr +
    '%"></div></div><div class="quiz-question"><div class="quiz-q-label">Câu ' +
    (state.quizIndex + 1) +
    "/" +
    state.quizQuestions.length +
    '</div><div class="quiz-q-hanzi" style="' +
    (q.isCn ? "" : "font-size:22px;font-family:Be Vietnam Pro") +
    '">' +
    q.prompt +
    '</div><div class="quiz-q-pinyin">' +
    q.sub +
    '</div></div><div class="quiz-options">' +
    optHtml +
    "</div></div>"
  );
}

function gen79Quiz(s, type) {
  const words = shuffle(s.words);
  const pool = HSK79_ALL;
  state.quizQuestions = words.map((w) => {
    if (type === "meaning") {
      const cn = Math.random() < 0.5;
      if (cn) {
        let wr = shuffle(
          pool.filter((x) => x.vi !== w.vi).map((x) => x.vi),
        ).slice(0, 3);
        let opts = shuffle([w.vi, ...wr]);
        return {
          prompt: w.h,
          sub: w.p,
          ci: opts.indexOf(w.vi),
          options: opts,
          sel: -1,
          isCn: false,
        };
      } else {
        let wr = shuffle(
          pool.filter((x) => x.h !== w.h).map((x) => x.h),
        ).slice(0, 3);
        let opts = shuffle([w.h, ...wr]);
        return {
          prompt: w.vi,
          sub: "Chọn từ tiếng Trung đúng",
          ci: opts.indexOf(w.h),
          options: opts,
          sel: -1,
          isCn: true,
        };
      }
    } else {
      let wr = shuffle(
        pool.filter((x) => x.h !== w.h).map((x) => x.h),
      ).slice(0, 3);
      let opts = shuffle([w.h, ...wr]);
      return {
        prompt: w.vi,
        sub: "Chọn từ đúng",
        ci: opts.indexOf(w.h),
        options: opts,
        sel: -1,
        isCn: true,
      };
    }
  });
  state.quizIndex = 0;
  state.quizScore = 0;
  state.quizAnswered = false;
  state.quizDone = false;
}

function r79Fill(s) {
  if (!state.quizQuestions.length || state.rQuizType !== "79f_" + s.id) {
    state.rQuizType = "79f_" + s.id;
    gen79Fill(s);
  }
  if (state.quizDone) {
    const t = state.quizQuestions.length,
      p = Math.round((state.quizScore / t) * 100);
    let m =
      p >= 90
        ? "🎉 Xuất sắc!"
        : p >= 70
          ? "👍 Khá tốt!"
          : p >= 50
            ? "💪 Cần ôn thêm!"
            : "📚 Hãy ôn lại nhé!";
    return (
      '<div class="quiz-result fade-in"><div class="quiz-score">' +
      state.quizScore +
      "/" +
      t +
      '</div><div class="quiz-score-label">' +
      m +
      " Đúng " +
      p +
      '%</div><button class="quiz-restart" data-action="quiz-restart-79">Làm lại</button></div>'
    );
  }
  const q = state.quizQuestions[state.quizIndex],
    pr = (state.quizIndex / state.quizQuestions.length) * 100;
  let optHtml = q.options
    .map((o, i) => {
      let c = "";
      if (state.quizAnswered) {
        if (i === q.ci) c = "correct";
        else if (i === q.sel) c = "wrong";
      }
      return (
        '<button class="quiz-option ' +
        c +
        '" data-quiz-opt="' +
        i +
        '" ' +
        (state.quizAnswered ? "disabled" : "") +
        ">" +
        o +
        "</button>"
      );
    })
    .join("");
  return (
    '<div class="quiz-container fade-in"><div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:' +
    pr +
    '%"></div></div><div class="quiz-question"><div class="quiz-q-label">Câu ' +
    (state.quizIndex + 1) +
    "/" +
    state.quizQuestions.length +
    ' — Điền từ vào chỗ trống</div><div style="font-family:Noto Sans SC,sans-serif;font-size:24px;font-weight:500;color:var(--ink);line-height:1.6;margin:12px 0">' +
    q.sentence +
    '</div><div class="quiz-q-pinyin" style="font-size:13px">' +
    q.hint +
    '</div></div><div class="quiz-options">' +
    optHtml +
    "</div></div>"
  );
}

function gen79Fill(s) {
  const pool = s.words.filter((w) => w.ex && w.ex.length > 3);
  const all = HSK79_ALL;
  const words = shuffle(pool).slice(0, Math.min(20, pool.length));
  state.quizQuestions = words.map((w) => {
    let phrases = w.ex
      .split(/[；;]/)
      .map((p) => p.trim())
      .filter((p) => p.length > 1);
    let match =
      phrases.find((p) => p.indexOf(w.h) >= 0) || phrases[0] || w.ex;
    let idx = match.indexOf("(");
    let cn = idx > 0 ? match.substring(0, idx).trim() : match;
    let vi = idx > 0 ? match.substring(idx).trim() : w.vi;
    let blank = cn.replace(w.h, "______");
    if (blank === cn) {
      blank = cn.replace(
        new RegExp("[" + w.h[0] + "][^，。！？ ]*"),
        "______",
      );
    }
    let wr = shuffle(
      all.filter((x) => x.h !== w.h).map((x) => x.h),
    ).slice(0, 3);
    let opts = shuffle([w.h, ...wr]);
    return {
      sentence: blank,
      hint: vi,
      ci: opts.indexOf(w.h),
      options: opts,
      sel: -1,
    };
  });
  state.quizIndex = 0;
  state.quizScore = 0;
  state.quizAnswered = false;
  state.quizDone = false;
}

function renderLesson() {
  const lessons = getLessons();
  const lesson = lessons.find((l) => l.id === state.lessonId);
  if (!lesson) return "";
  return (
    '<div class="fade-in"><div><button class="back-btn" data-action="back">← Quay lại</button><div class="lesson-view-title">第' +
    lesson.id +
    "课 · " +
    lesson.title +
    '</div><div class="lesson-view-sub">' +
    lesson.titleVi +
    " — " +
    lesson.words.length +
    ' từ vựng</div></div><div class="mode-tabs"><button class="mode-tab ' +
    (state.mode === "list" ? "active" : "") +
    '" data-mode="list">📋 Danh sách</button><button class="mode-tab ' +
    (state.mode === "flashcard" ? "active" : "") +
    '" data-mode="flashcard">🃏 Lật thẻ</button><button class="mode-tab ' +
    (state.mode === "quiz" ? "active" : "") +
    '" data-mode="quiz">✏️ Trắc nghiệm</button></div>' +
    (state.mode === "list" ? renderWordList(lesson) : "") +
    (state.mode === "flashcard" ? renderFlashcard(lesson) : "") +
    (state.mode === "quiz" ? renderQuiz(lesson) : "") +
    "</div>"
  );
}

function renderWordList(lesson) {
  let items = lesson.words
    .map((w) => {
      const hv = wHv(w);
      const ex = wEx(w);
      const en = w.en ? " · " + w.en : "";
      return (
        '<div class="word-item"><button class="audio-btn" data-speak="' +
        wHz(w) +
        '">🔊</button><div class="word-hanzi">' +
        wHz(w) +
        '</div><div class="word-info"><div class="word-pinyin">' +
        wPy(w) +
        (hv
          ? ' <span style="color:var(--gold);font-size:12px">' + hv + "</span>"
          : "") +
        '</div><div class="word-meaning">' +
        wVi(w) +
        en +
        "</div>" +
        (ex
          ? '<div style="font-size:12px;color:#999;margin-top:3px;line-height:1.4">' +
            ex +
            "</div>"
          : "") +
        "</div>" +
        (wPos(w) ? '<div class="word-pos">' + wPos(w) + "</div>" : "") +
        "</div>"
      );
    })
    .join("");
  return (
    '<div class="toolbar"><span class="word-count">' +
    lesson.words.length +
    ' từ</span></div><div class="word-list">' +
    items +
    "</div>"
  );
}

function renderFlashcard(lesson) {
  if (!state.fcShuffled.length) {
    state.fcShuffled = shuffle(lesson.words);
    state.fcIndex = 0;
    state.fcFlipped = false;
  }
  const w = state.fcShuffled[state.fcIndex];
  const hv = wHv(w);
  const ex = wEx(w);
  return (
    '<div class="flashcard-container"><div class="flashcard-progress">' +
    (state.fcIndex + 1) +
    " / " +
    state.fcShuffled.length +
    '</div><div class="flashcard" data-action="flip"><div class="flashcard-inner ' +
    (state.fcFlipped ? "flipped" : "") +
    '"><div class="flashcard-front"><div class="fc-hanzi">' +
    wHz(w) +
    '</div><div class="fc-hint">Nhấn hoặc Space để lật · ← → chuyển từ</div></div><div class="flashcard-back"><div class="fc-pinyin">' +
    wPy(w) +
    "</div>" +
    (hv
      ? '<div style="font-size:14px;color:rgba(255,255,255,0.6);margin-bottom:10px">' +
        hv +
        "</div>"
      : "") +
    '<div class="fc-meaning">' +
    wVi(w) +
    (w.en
      ? '<br><small style="opacity:0.7">' + w.en + "</small>"
      : "") +
    "</div>" +
    (ex
      ? '<div style="font-size:13px;color:rgba(255,255,255,0.5);margin-top:12px;line-height:1.5">' +
        ex +
        "</div>"
      : "") +
    '</div></div></div><div class="fc-controls"><button class="fc-btn prev" data-action="fc-prev" ' +
    (state.fcIndex === 0 ? "disabled" : "") +
    '>← Trước</button><button class="shuffle-btn" data-action="fc-shuffle">🔀 Xáo trộn</button><button class="fc-btn next" data-action="fc-next" ' +
    (state.fcIndex >= state.fcShuffled.length - 1 ? "disabled" : "") +
    ">Tiếp →</button></div></div>"
  );
}

function renderQuiz(lesson) {
  if (!state.quizQuestions.length) generateQuiz(lesson);
  if (state.quizDone) {
    const t = state.quizQuestions.length,
      p = Math.round((state.quizScore / t) * 100);
    let m =
      p >= 90
        ? "🎉 Xuất sắc!"
        : p >= 70
          ? "👍 Khá tốt!"
          : p >= 50
            ? "💪 Cần ôn thêm!"
            : "📚 Hãy ôn lại nhé!";
    return (
      '<div class="quiz-result fade-in"><div class="quiz-score">' +
      state.quizScore +
      "/" +
      t +
      '</div><div class="quiz-score-label">' +
      m +
      " Đúng " +
      p +
      '%</div><button class="quiz-restart" data-action="quiz-restart">Làm lại</button></div>'
    );
  }
  const q = state.quizQuestions[state.quizIndex],
    pr = (state.quizIndex / state.quizQuestions.length) * 100;
  let qLabel =
    q.type === "vn2cn"
      ? "Chọn từ tiếng Trung:"
      : "Chọn nghĩa tiếng Việt:";
  let qStyle =
    q.type === "vn2cn"
      ? "font-size:22px;font-weight:600;font-family:Be Vietnam Pro,sans-serif"
      : "";
  let opts = q.options
    .map((o, i) => {
      let c = "";
      if (state.quizAnswered) {
        if (i === q.ci) c = "correct";
        else if (i === q.sel) c = "wrong";
      }
      return (
        '<button class="quiz-option ' +
        c +
        '" data-quiz-opt="' +
        i +
        '" ' +
        (state.quizAnswered ? "disabled" : "") +
        ' style="' +
        (q.type === "vn2cn"
          ? "font-family:Noto Sans SC,sans-serif;font-size:20px"
          : "") +
        '">' +
        o +
        "</button>"
      );
    })
    .join("");
  return (
    '<div class="quiz-container fade-in"><div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:' +
    pr +
    '%"></div></div><div class="quiz-question"><div class="quiz-q-label">Câu ' +
    (state.quizIndex + 1) +
    "/" +
    state.quizQuestions.length +
    " — " +
    qLabel +
    '</div><div class="quiz-q-hanzi" style="' +
    qStyle +
    '">' +
    q.hanzi +
    '</div><div class="quiz-q-pinyin">' +
    q.pinyin +
    '</div></div><div class="quiz-options">' +
    opts +
    "</div></div>"
  );
}

function generateQuiz(lesson) {
  const words = shuffle(lesson.words);
  const allW = getQuizPool();
  state.quizQuestions = words.map((w) => {
    const isCnToVn = Math.random() < 0.5;
    if (isCnToVn) {
      let wr = shuffle(
        allW.filter((x) => wVi(x) !== wVi(w)).map((x) => wVi(x)),
      ).slice(0, 3);
      let opts = shuffle([wVi(w), ...wr]);
      return {
        hanzi: wHz(w),
        pinyin: wPy(w),
        ci: opts.indexOf(wVi(w)),
        options: opts,
        sel: -1,
        type: "cn2vn",
      };
    } else {
      let wr = shuffle(
        allW.filter((x) => wHz(x) !== wHz(w)).map((x) => wHz(x)),
      ).slice(0, 3);
      let opts = shuffle([wHz(w), ...wr]);
      return {
        hanzi: wVi(w),
        pinyin: "Chọn từ tiếng Trung đúng",
        ci: opts.indexOf(wHz(w)),
        options: opts,
        sel: -1,
        type: "vn2cn",
      };
    }
  });
  state.quizIndex = 0;
  state.quizScore = 0;
  state.quizAnswered = false;
  state.quizDone = false;
}

function attachEvents() {
  document.querySelectorAll("[data-nav]").forEach((b) => {
    b.onclick = () => {
      if (b.dataset.nav === "home") {
        state.view = "home";
      } else if (b.dataset.nav === "level") {
        state.view = "level";
        state.level = b.dataset.lv;
      }
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
  });
  document.querySelectorAll("[data-lesson]").forEach((c) => {
    c.onclick = () => {
      const lv = c.dataset.lv;
      if (lv) state.level = lv;
      state.view = "lesson";
      state.lessonId = parseInt(c.dataset.lesson);
      state.mode = "list";
      state.fcShuffled = [];
      state.quizQuestions = [];
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
  });
  document.querySelectorAll("[data-action]").forEach((b) => {
    b.onclick = (e) => {
      e.stopPropagation();
      const a = b.dataset.action;
      if (a === "back") {
        state.view = "level";
        render();
      }
      if (a === "flip") {
        state.fcFlipped = !state.fcFlipped;
        render();
      }
      if (a === "fc-prev") {
        state.fcIndex--;
        state.fcFlipped = false;
        render();
      }
      if (a === "fc-next") {
        state.fcIndex++;
        state.fcFlipped = false;
        render();
      }
      if (a === "fc-shuffle") {
        const l = getLessons().find((x) => x.id === state.lessonId);
        state.fcShuffled = shuffle(l.words);
        state.fcIndex = 0;
        state.fcFlipped = false;
        render();
      }
      if (a === "quiz-restart") {
        const l = getLessons().find((x) => x.id === state.lessonId);
        generateQuiz(l);
        render();
      }
    };
  });
  document.querySelectorAll("[data-mode]").forEach((b) => {
    b.onclick = () => {
      state.mode = b.dataset.mode;
      if (state.mode === "flashcard") state.fcShuffled = [];
      if (state.mode === "quiz") state.quizQuestions = [];
      render();
    };
  });
  document.querySelectorAll("[data-hsk79set]").forEach((c) => {
    c.onclick = () => {
      state.view = "hsk79set";
      state.lessonId = parseInt(c.dataset.hsk79set);
      state.mode = "list";
      state.fcShuffled = [];
      state.quizQuestions = [];
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
  });
  document.querySelectorAll("[data-m79]").forEach((b) => {
    b.onclick = () => {
      state.mode = b.dataset.m79;
      state.fcShuffled = [];
      state.quizQuestions = [];
      render();
    };
  });
  document.querySelectorAll('[data-action="back-hsk79"]').forEach((b) => {
    b.onclick = () => {
      state.view = "level";
      state.level = "hsk79";
      render();
    };
  });
  document
    .querySelectorAll('[data-action="fc-shuffle-79"]')
    .forEach((b) => {
      b.onclick = (e) => {
        e.stopPropagation();
        const s = getHSK79Sets().find((x) => x.id === state.lessonId);
        state.fcShuffled = shuffle(s.words);
        state.fcIndex = 0;
        state.fcFlipped = false;
        render();
      };
    });
  document
    .querySelectorAll('[data-action="quiz-restart-79"]')
    .forEach((b) => {
      b.onclick = () => {
        const s = getHSK79Sets().find((x) => x.id === state.lessonId);
        if (state.rQuizType.startsWith("79f_")) gen79Fill(s);
        else {
          let t = state.mode;
          gen79Quiz(s, t);
        }
        render();
      };
    });
  document
    .querySelectorAll('[data-action="open-grammarAdv"]')
    .forEach((b) => {
      b.onclick = () => {
        state.view = "grammarAdv";
        state.level = b.dataset.glv;
        render();
        window.scrollTo({ top: 0, behavior: "smooth" });
      };
    });
  document
    .querySelectorAll('[data-action="back-grammarAdv"]')
    .forEach((b) => {
      b.onclick = () => {
        state.view = "level";
        render();
      };
    });
  document.querySelectorAll("[data-hsk456set]").forEach((c) => {
    c.onclick = () => {
      if (c.dataset.navLv) state.level = c.dataset.navLv;
      state.view = "hsk456set";
      state.lessonId = parseInt(c.dataset.hsk456set);
      state.mode = "list";
      state.fcShuffled = [];
      state.quizQuestions = [];
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
  });
  document.querySelectorAll("[data-m456]").forEach((b) => {
    b.onclick = () => {
      state.mode = b.dataset.m456;
      state.fcShuffled = [];
      state.quizQuestions = [];
      render();
    };
  });
  document.querySelectorAll('[data-action="back-456"]').forEach((b) => {
    b.onclick = () => {
      state.view = "level";
      render();
    };
  });
  document
    .querySelectorAll('[data-action="fc-shuffle-456"]')
    .forEach((b) => {
      b.onclick = (e) => {
        e.stopPropagation();
        const s = getHSK456Sets().find((x) => x.id === state.lessonId);
        state.fcShuffled = shuffle(s.words);
        state.fcIndex = 0;
        state.fcFlipped = false;
        render();
      };
    });
  document
    .querySelectorAll('[data-action="quiz-restart-456"]')
    .forEach((b) => {
      b.onclick = () => {
        const d = getHSK456Data();
        const s = getHSK456Sets().find((x) => x.id === state.lessonId);
        if (state.rQuizType.startsWith("456_f")) gen456Fill(s, d);
        else gen456Quiz(s, d);
        render();
      };
    });
  document.querySelectorAll("[data-grammar-lesson]").forEach((c) => {
    c.onclick = () => {
      state.lessonId = parseInt(c.dataset.grammarLesson);
      state.mode = "list";
      state.fcShuffled = [];
      state.quizQuestions = [];
      render();
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
  });
  document
    .querySelectorAll('[data-action="back-grammar-lesson"]')
    .forEach((b) => {
      b.onclick = () => {
        state.lessonId = null;
        render();
      };
    });
  document
    .querySelectorAll('[data-action="open-grammar"]')
    .forEach((b) => {
      b.onclick = () => {
        state.view = "grammar";
        state.level = b.dataset.glv;
        state.lessonId = null;
        state.mode = "list";
        state.fcShuffled = [];
        state.quizQuestions = [];
        render();
        window.scrollTo({ top: 0, behavior: "smooth" });
      };
    });
  document
    .querySelectorAll('[data-action="back-grammar"]')
    .forEach((b) => {
      b.onclick = () => {
        state.view = "level";
        render();
        window.scrollTo({ top: 0 });
      };
    });
  document.querySelectorAll("[data-mgr]").forEach((b) => {
    b.onclick = () => {
      state.mode = b.dataset.mgr;
      state.fcShuffled = [];
      state.quizQuestions = [];
      render();
    };
  });
  document
    .querySelectorAll('[data-action="fc-shuffle-gr"]')
    .forEach((b) => {
      b.onclick = (e) => {
        e.stopPropagation();
        const g = getGrammarData();
        var pts = state.lessonId
          ? g.data[state.lessonId]
          : Object.values(g.data).flat();
        state.fcShuffled = shuffle(pts);
        state.fcIndex = 0;
        state.fcFlipped = false;
        render();
      };
    });
  document
    .querySelectorAll('[data-action="quiz-restart-gr"]')
    .forEach((b) => {
      b.onclick = () => {
        const g = getGrammarData();
        var pts = state.lessonId
          ? g.data[state.lessonId]
          : Object.values(g.data).flat();
        genGrQuiz({ data: pts, num: g.num, color: g.color });
        render();
      };
    });
  document.querySelectorAll("[data-rmode3]").forEach((b) => {
    b.onclick = () => {
      state.rMode = b.dataset.rmode3;
      state.fcShuffled = [];
      state.quizQuestions = [];
      render();
    };
  });
  document.querySelectorAll("[data-rmode4]").forEach((b) => {
    b.onclick = () => {
      state.rMode = b.dataset.rmode4;
      state.fcShuffled = [];
      state.quizQuestions = [];
      render();
    };
  });
  document
    .querySelectorAll('[data-action="open-review4"]')
    .forEach((b) => {
      b.onclick = () => {
        state.view = "review4";
        state.rMode = "list";
        state.fcShuffled = [];
        state.quizQuestions = [];
        render();
        window.scrollTo({ top: 0, behavior: "smooth" });
      };
    });
  document
    .querySelectorAll('[data-action="back-review4"]')
    .forEach((b) => {
      b.onclick = () => {
        state.view = "level";
        state.level = "hsk4";
        render();
      };
    });
  document
    .querySelectorAll('[data-action="fc-shuffle-r4"]')
    .forEach((b) => {
      b.onclick = (e) => {
        e.stopPropagation();
        state.fcShuffled = shuffle(HSK4_ALL);
        state.fcIndex = 0;
        state.fcFlipped = false;
        render();
      };
    });
  document
    .querySelectorAll('[data-action="quiz-restart-r4"]')
    .forEach((b) => {
      b.onclick = () => {
        if (state.rQuizType === "r4_fillin") genR4Fill();
        else {
          let t = state.rQuizType.replace("r4_", "");
          genR4Quiz(t);
        }
        render();
      };
    });
  document
    .querySelectorAll('[data-action="open-review3"]')
    .forEach((b) => {
      b.onclick = () => {
        state.view = "review3";
        state.rMode = "list";
        state.fcShuffled = [];
        state.quizQuestions = [];
        render();
        window.scrollTo({ top: 0, behavior: "smooth" });
      };
    });
  document
    .querySelectorAll('[data-action="back-review3"]')
    .forEach((b) => {
      b.onclick = () => {
        state.view = "level";
        state.level = "hsk3";
        render();
      };
    });
  document
    .querySelectorAll('[data-action="fc-shuffle-r3"]')
    .forEach((b) => {
      b.onclick = (e) => {
        e.stopPropagation();
        state.fcShuffled = shuffle(HSK3_ALL);
        state.fcIndex = 0;
        state.fcFlipped = false;
        render();
      };
    });
  document
    .querySelectorAll('[data-action="quiz-restart-r3"]')
    .forEach((b) => {
      b.onclick = () => {
        if (state.rQuizType === "r3_fillin") genR3Fill();
        else {
          let t = state.rQuizType.replace("r3_", "");
          genR3Quiz(t);
        }
        render();
      };
    });
  document.querySelectorAll("[data-rmode2]").forEach((b) => {
    b.onclick = () => {
      state.rMode = b.dataset.rmode2;
      state.fcShuffled = [];
      state.quizQuestions = [];
      render();
    };
  });
  document
    .querySelectorAll('[data-action="open-review2"]')
    .forEach((b) => {
      b.onclick = () => {
        state.view = "review2";
        state.rMode = "list";
        state.fcShuffled = [];
        state.quizQuestions = [];
        render();
        window.scrollTo({ top: 0, behavior: "smooth" });
      };
    });
  document
    .querySelectorAll('[data-action="back-review2"]')
    .forEach((b) => {
      b.onclick = () => {
        state.view = "level";
        state.level = "hsk2";
        render();
      };
    });
  document
    .querySelectorAll('[data-action="fc-shuffle-r2"]')
    .forEach((b) => {
      b.onclick = (e) => {
        e.stopPropagation();
        state.fcShuffled = shuffle(HSK2_ALL);
        state.fcIndex = 0;
        state.fcFlipped = false;
        render();
      };
    });
  document
    .querySelectorAll('[data-action="quiz-restart-r2"]')
    .forEach((b) => {
      b.onclick = () => {
        if (state.rQuizType === "r2_fillin") genR2FillIn();
        else {
          let t = state.rQuizType.replace("r2_", "");
          genR2Quiz(t);
        }
        render();
      };
    });
  document.querySelectorAll("[data-rmode]").forEach((b) => {
    b.onclick = () => {
      state.rMode = b.dataset.rmode;
      state.fcShuffled = [];
      state.quizQuestions = [];
      render();
    };
  });
  document
    .querySelectorAll('[data-action="open-review"]')
    .forEach((b) => {
      b.onclick = () => {
        state.view = "review";
        state.rMode = "list";
        state.fcShuffled = [];
        state.quizQuestions = [];
        render();
        window.scrollTo({ top: 0, behavior: "smooth" });
      };
    });
  document
    .querySelectorAll('[data-action="back-review"]')
    .forEach((b) => {
      b.onclick = () => {
        state.view = "level";
        state.level = "hsk1";
        render();
      };
    });
  document
    .querySelectorAll('[data-action="fc-shuffle-review"]')
    .forEach((b) => {
      b.onclick = (e) => {
        e.stopPropagation();
        state.fcShuffled = shuffle(HSK1_ALL);
        state.fcIndex = 0;
        state.fcFlipped = false;
        render();
      };
    });
  document
    .querySelectorAll('[data-action="quiz-restart-review"]')
    .forEach((b) => {
      b.onclick = () => {
        generateReviewQuiz(state.rQuizType);
        render();
      };
    });
  document.querySelectorAll(".word-item").forEach((el) => {
    el.addEventListener("click", function (e) {
      if (
        e.target.closest(".audio-btn") ||
        e.target.closest(".stroke-play")
      )
        return;
      const hanzi = el.querySelector(".word-hanzi");
      if (hanzi) toggleWordStrokes(el, hanzi.textContent.trim());
    });
  });
  document.querySelectorAll("[data-speak]").forEach((b) => {
    b.onclick = (e) => {
      e.stopPropagation();
      speak(b.dataset.speak);
    };
  });
  document.querySelectorAll("[data-quiz-opt]").forEach((b) => {
    b.onclick = () => {
      if (state.quizAnswered) return;
      const i = parseInt(b.dataset.quizOpt);
      const q = state.quizQuestions[state.quizIndex];
      q.sel = i;
      state.quizAnswered = true;
      if (i === q.ci) state.quizScore++;
      render();
      setTimeout(() => {
        if (state.quizIndex < state.quizQuestions.length - 1) {
          state.quizIndex++;
          state.quizAnswered = false;
          render();
        } else {
          state.quizDone = true;
          render();
        }
      }, 1200);
    };
  });
}

document.addEventListener("keydown", function (e) {
  if (
    state.mode === "flashcard" ||
    (state.view === "review" && state.rMode === "flashcard") ||
    (state.view === "review2" && state.rMode === "flashcard") ||
    (state.view === "review3" && state.rMode === "flashcard") ||
    (state.view === "review4" && state.rMode === "flashcard") ||
    (state.view === "grammar" && state.mode === "flashcard") ||
    (state.view === "hsk79set" && state.mode === "flashcard") ||
    (state.view === "hsk456set" && state.mode === "flashcard")
  ) {
    if (
      e.code === "Space" ||
      e.code === "ArrowUp" ||
      e.code === "ArrowDown"
    ) {
      e.preventDefault();
      state.fcFlipped = !state.fcFlipped;
      render();
    }
    if (e.code === "ArrowRight") {
      e.preventDefault();
      if (state.fcIndex < state.fcShuffled.length - 1) {
        state.fcIndex++;
        state.fcFlipped = false;
        render();
      }
    }
    if (e.code === "ArrowLeft") {
      e.preventDefault();
      if (state.fcIndex > 0) {
        state.fcIndex--;
        state.fcFlipped = false;
        render();
      }
    }
    if (e.code === "KeyS" || e.code === "KeyR") {
      e.preventDefault();
      if (state.fcShuffled.length)
        speak(wHz(state.fcShuffled[state.fcIndex]));
    }
  }
});
render();
