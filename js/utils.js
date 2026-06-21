function wHz(w) {
  return w.hanzi || w.h;
}
function wPy(w) {
  return w.pinyin || w.p;
}
function wHv(w) {
  return w.hv || "";
}
function wPos(w) {
  return w.pos || w.ps || "";
}
function wVi(w) {
  return w.vi;
}
function wEx(w) {
  return w.ex || "";
}

function toggleWordStrokes(el, hanzi) {
  const existing = el.querySelector(".word-strokes");
  if (existing) {
    existing.remove();
    expandedWord = null;
    return;
  }
  document.querySelectorAll(".word-strokes").forEach((s) => s.remove());
  expandedWord = hanzi;
  const div = document.createElement("div");
  div.className = "word-strokes";
  hwInstances = [];
  const chars = hanzi.split("");
  const targets = [];
  chars.forEach((ch, i) => {
    const wrap = document.createElement("div");
    wrap.className = "stroke-char";
    const svgDiv = document.createElement("div");
    targets.push({ el: svgDiv, ch: ch });
    wrap.appendChild(svgDiv);
    const label = document.createElement("span");
    label.textContent = ch;
    wrap.appendChild(label);
    div.appendChild(wrap);
  });
  const playBtn = document.createElement("button");
  playBtn.className = "stroke-play";
  playBtn.textContent = "▶ Xem viết";
  playBtn.onclick = function (e) {
    e.stopPropagation();
    hwInstances.forEach(function (w) {
      w.animateCharacter();
    });
  };
  div.appendChild(playBtn);

  el.appendChild(div);
  setTimeout(function () {
    targets.forEach(function (t) {
      if (typeof HanziWriter !== "undefined") {
        try {
          var w = HanziWriter.create(t.el, t.ch, {
            width: 80,
            height: 80,
            padding: 5,
            strokeAnimationSpeed: 1,
            delayBetweenStrokes: 300,
            strokeColor: "#1A1A2E",
            radicalColor: "#D96B64",
            showOutline: true,
            showCharacter: false,
          });
          hwInstances.push(w);
          w.animateCharacter();
        } catch (e) {
          t.el.innerHTML =
            '<span style="font-size:40px;font-family:Noto Sans SC">' +
            t.ch +
            "</span>";
        }
      } else {
        t.el.innerHTML =
          '<span style="font-size:40px;font-family:Noto Sans SC">' +
          t.ch +
          "</span>";
      }
    });
  }, 100);
}

function speak(text) {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = "zh-CN";
    u.rate = 0.8;
    const voices = window.speechSynthesis.getVoices();
    const zh = voices.find((v) => v.lang.startsWith("zh"));
    if (zh) u.voice = zh;
    window.speechSynthesis.speak(u);
  }
}
window.speechSynthesis && window.speechSynthesis.getVoices();

function getHSK79Sets() {
  const sets = [];
  const sz = 20;
  for (let i = 0; i < HSK79_ALL.length; i += sz) {
    const id = Math.floor(i / sz) + 1;
    sets.push({
      id,
      words: HSK79_ALL.slice(i, i + sz),
      start: i + 1,
      end: Math.min(i + sz, HSK79_ALL.length),
    });
  }
  return sets;
}

let expandedWord = null;
let hwInstances = [];
