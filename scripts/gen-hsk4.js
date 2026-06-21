const fs = require("fs");
const path = require("path");
const allPath = path.join(__dirname, "..", "data", "hsk4-all.js");
const all = new Function(
  fs.readFileSync(allPath, "utf8") + "; return HSK4_ALL;",
)();
const sz = 20;
const lessons = [];
for (let i = 0; i < all.length; i += sz) {
  const id = Math.floor(i / sz) + 1;
  const words = all.slice(i, i + sz);
  const start = i + 1;
  const end = Math.min(i + sz, all.length);
  lessons.push({
    id,
    title: words
      .slice(0, 4)
      .map((w) => w.h)
      .join(" · ") + "…",
    titleVi: "Bài " + id + " — Từ " + start + "–" + end,
    words,
  });
}
fs.writeFileSync(
  path.join(__dirname, "..", "data", "hsk4.js"),
  "const HSK4 = " + JSON.stringify(lessons, null, 2) + ";\n",
  "utf8",
);
console.log(
  "lessons:",
  lessons.length,
  "words:",
  lessons.reduce((s, l) => s + l.words.length, 0),
);
