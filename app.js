const canvases = [
  document.getElementById("gameCanvas1"),
  document.getElementById("gameCanvas2")
];
const contexts = canvases.map(canvas => canvas.getContext("2d"));

const ui = {
  distance: document.getElementById("distanceValue"),
  stage: document.getElementById("stageLabel"),
  start: document.getElementById("startScreen"),
  over: document.getElementById("gameOver"),
  question: document.getElementById("questionPanel"),
  questionText: document.getElementById("questionText"),
  names: [document.getElementById("playerName1"), document.getElementById("playerName2")],
  labels: [document.getElementById("playerLabel1"), document.getElementById("playerLabel2")],
  huds: [document.getElementById("playerHud1"), document.getElementById("playerHud2")],
  scores: [document.getElementById("scoreValue1"), document.getElementById("scoreValue2")],
  coins: [document.getElementById("coinValue1"), document.getElementById("coinValue2")],
  lives: [document.getElementById("lifeValue1"), document.getElementById("lifeValue2")],
  correct: [document.getElementById("correctValue1"), document.getElementById("correctValue2")],
  questions: [document.getElementById("questionValue1"), document.getElementById("questionValue2")],
  toasts: [document.getElementById("toast1"), document.getElementById("toast2")],
  board: document.getElementById("leaderboardList"),
  gallery: document.getElementById("captureGallery"),
  captureModal: document.getElementById("captureModal"),
  captureVideo: document.getElementById("captureVideo"),
  captureStatus: document.getElementById("captureStatus"),
  captureCountdown: document.getElementById("captureCountdown")
};

const mathQuestions = [
  { q: "삼각형의 세 각의 합은?", answer: "180°", wrong: ["90°", "360°"] },
  { q: "직각의 크기는?", answer: "90°", wrong: ["45°", "180°"] },
  { q: "평각의 크기는?", answer: "180°", wrong: ["90°", "360°"] },
  { q: "원의 지름은 반지름의 몇 배?", answer: "2배", wrong: ["1배", "4배"] },
  { q: "정사각형의 네 변의 길이는?", answer: "모두 같다", wrong: ["모두 다르다", "두 변만 같다"] },
  { q: "0은 양수일까?", answer: "양수도 음수도 아님", wrong: ["양수", "음수"] },
  { q: "|-7|의 값은?", answer: "7", wrong: ["-7", "0"] },
  { q: "2³의 값은?", answer: "8", wrong: ["6", "9"] },
  { q: "√81의 값은?", answer: "9", wrong: ["8", "18"] },
  { q: "1/2을 소수로 나타내면?", answer: "0.5", wrong: ["0.2", "1.2"] },
  { q: "0.25를 백분율로 나타내면?", answer: "25%", wrong: ["2.5%", "250%"] },
  { q: "점 (3, 2)는 몇 사분면?", answer: "제1사분면", wrong: ["제2사분면", "제4사분면"] },
  { q: "점 (-2, 4)는 몇 사분면?", answer: "제2사분면", wrong: ["제1사분면", "제3사분면"] },
  { q: "y = 2x에서 x=3일 때 y는?", answer: "6", wrong: ["5", "9"] },
  { q: "동전 1개를 던져 앞면이 나올 확률은?", answer: "1/2", wrong: ["1/3", "1"] },
  { q: "자료의 합을 개수로 나눈 값은?", answer: "평균", wrong: ["최빈값", "범위"] },
  { q: "가장 많이 나타난 값은?", answer: "최빈값", wrong: ["평균", "중앙값"] },
  { q: "a+a+a를 간단히 하면?", answer: "3a", wrong: ["a³", "3+a"] },
  { q: "x²-x²의 값은?", answer: "0", wrong: ["x", "2x²"] },
  { q: "(a+b)×2를 전개하면?", answer: "2a+2b", wrong: ["2a+b", "a+2b"] },
  { q: "12와 18의 최대공약수는?", answer: "6", wrong: ["3", "9"] },
  { q: "4와 6의 최소공배수는?", answer: "12", wrong: ["10", "24"] },
  { q: "소수인 수는?", answer: "7", wrong: ["9", "15"] },
  { q: "서로 평행한 두 직선은?", answer: "만나지 않는다", wrong: ["한 점에서 만난다", "항상 수직이다"] }
];

const randomQuestionFactories = [
  () => {
    const a = randomInt(4, 18);
    const b = randomInt(3, 16);
    return numericQuestion(`${a} + ${b}의 값은?`, a + b);
  },
  () => {
    const b = randomInt(3, 14);
    const answer = randomInt(4, 18);
    return numericQuestion(`${answer + b} - ${b}의 값은?`, answer);
  },
  () => {
    const a = randomInt(2, 9);
    const b = randomInt(2, 9);
    return numericQuestion(`${a} × ${b}의 값은?`, a * b, Math.max(2, a));
  },
  () => {
    const answer = randomInt(2, 12);
    const divisor = randomInt(2, 9);
    return numericQuestion(`${answer * divisor} ÷ ${divisor}의 값은?`, answer);
  },
  () => {
    const answer = randomInt(2, 15);
    const add = randomInt(2, 12);
    return numericQuestion(`x + ${add} = ${answer + add}일 때 x는?`, answer);
  },
  () => {
    const answer = randomInt(2, 12);
    const multiplier = randomInt(2, 6);
    return numericQuestion(`${multiplier}x = ${answer * multiplier}일 때 x는?`, answer);
  },
  () => {
    const negative = randomInt(2, 12);
    const add = randomInt(negative + 1, negative + 12);
    return numericQuestion(`(-${negative}) + ${add}의 값은?`, add - negative);
  },
  () => {
    const side = randomInt(2, 12);
    return numericQuestion(`한 변이 ${side}cm인 정사각형의 둘레는?`, side * 4, side);
  },
  () => {
    const width = randomInt(3, 12);
    const height = randomInt(2, 10);
    return numericQuestion(`가로 ${width}, 세로 ${height}인 직사각형의 넓이는?`, width * height, width);
  },
  () => {
    const a = randomInt(2, 9);
    const b = randomInt(2, 9);
    return { q: `${a}a + ${b}a를 간단히 하면?`, answer: `${a + b}a`, wrong: [`${a * b}a`, `${a + b}a²`] };
  },
  () => {
    const x = randomInt(1, 8);
    const slope = randomInt(2, 5);
    const intercept = randomInt(1, 6);
    return numericQuestion(`y=${slope}x+${intercept}, x=${x}일 때 y는?`, slope * x + intercept, slope);
  },
  () => {
    const first = randomInt(35, 75);
    const second = randomInt(35, 75);
    return numericQuestion(`삼각형의 두 각이 ${first}°, ${second}°일 때 나머지 각은?`, 180 - first - second, 10, "°");
  }
];

const intermediateQuestionFactories = [
  () => {
    const x = randomInt(2, 14);
    const a = randomInt(2, 6);
    const b = randomInt(3, 15);
    return numericQuestion(`${a}x + ${b} = ${a * x + b}일 때 x는?`, x, 4);
  },
  () => {
    const x = randomInt(2, 12);
    const a = randomInt(2, 5);
    const b = randomInt(2, 12);
    return numericQuestion(`${a}x - ${b} = ${a * x - b}일 때 x는?`, x, 4);
  },
  () => {
    const a = randomInt(3, 12);
    const b = randomInt(2, 9);
    const c = randomInt(2, 8);
    return numericQuestion(`${a} + ${b} × ${c}의 값은?`, a + b * c, 6);
  },
  () => {
    const a = randomInt(2, 10);
    const b = randomInt(2, 8);
    const c = randomInt(2, 7);
    return numericQuestion(`(${a} + ${b}) × ${c}의 값은?`, (a + b) * c, 8);
  },
  () => {
    const base = randomInt(2, 8);
    const percent = [10, 20, 25, 50][randomInt(0, 3)];
    const amount = base * 20;
    return numericQuestion(`${amount}의 ${percent}%는?`, amount * percent / 100, 5);
  },
  () => {
    const ratioA = randomInt(2, 6);
    const ratioB = randomInt(2, 6);
    const scale = randomInt(2, 8);
    return numericQuestion(`비가 ${ratioA}:${ratioB}일 때 앞의 수가 ${ratioA * scale}이면 뒤의 수는?`, ratioB * scale, 5);
  },
  () => {
    const negative = randomInt(3, 15);
    const multiplier = randomInt(2, 6);
    const add = randomInt(5, 25);
    return numericQuestion(`(-${negative}) × ${multiplier} + ${add}의 값은?`, -negative * multiplier + add, 7, "", true);
  },
  () => {
    const x = randomInt(2, 9);
    const slope = randomInt(-4, 5) || 2;
    const intercept = randomInt(-8, 8);
    return numericQuestion(`y=${slope}x${intercept >= 0 ? "+" : ""}${intercept}, x=${x}일 때 y는?`, slope * x + intercept, 6, "", true);
  },
  () => {
    const first = randomInt(35, 75);
    const exterior = randomInt(first + 25, 150);
    return numericQuestion(`삼각형의 한 외각이 ${exterior}°, 이웃하지 않은 한 내각이 ${first}°일 때 다른 내각은?`, exterior - first, 10, "°");
  },
  () => {
    const values = shuffle([randomInt(2, 8), randomInt(9, 15), randomInt(16, 24)]);
    const mean = Math.round(values.reduce((sum, value) => sum + value, 0) / 3);
    const adjusted = [values[0], values[1], mean * 3 - values[0] - values[1]];
    return numericQuestion(`${adjusted.join(", ")}의 평균은?`, mean, 4);
  }
];

const advancedQuestionFactories = [
  () => {
    const x = randomInt(2, 10);
    const a = randomInt(2, 5);
    const b = randomInt(2, 8);
    const c = randomInt(2, 6);
    return numericQuestion(`${a}(x+${b})=${a * (x + b)}일 때 x는?`, x, 4);
  },
  () => {
    const x = randomInt(2, 10);
    const y = randomInt(1, 9);
    return numericQuestion(`x+y=${x + y}, x-y=${x - y}일 때 x는?`, x, 4);
  },
  () => {
    const x = randomInt(2, 9);
    const y = randomInt(2, 9);
    return numericQuestion(`2x+y=${2 * x + y}, x+y=${x + y}일 때 y는?`, y, 4);
  },
  () => {
    const a = randomInt(2, 8);
    const b = randomInt(2, 8);
    const x = randomInt(2, 6);
    return numericQuestion(`${a}x²-${b}x에 x=${x}를 대입한 값은?`, a * x * x - b * x, 10, "", true);
  },
  () => {
    const triples = [[3, 4, 5], [5, 12, 13], [6, 8, 10]];
    const [a, b, c] = triples[randomInt(0, triples.length - 1)];
    return numericQuestion(`직각삼각형의 두 변이 ${a}, ${b}일 때 빗변은?`, c, 3);
  },
  () => {
    const red = randomInt(2, 6);
    const blue = randomInt(2, 6);
    return { q: `빨간 공 ${red}개, 파란 공 ${blue}개 중 빨간 공을 뽑을 확률은?`, answer: `${red}/${red + blue}`, wrong: [`${blue}/${red + blue}`, `${red}/${blue}`] };
  },
  () => {
    const first = randomInt(2, 8);
    const difference = randomInt(2, 6);
    const count = randomInt(4, 7);
    const last = first + difference * (count - 1);
    return numericQuestion(`등차수열 ${first}, ${first + difference}, … 의 ${count}번째 항은?`, last, 6);
  },
  () => {
    const width = randomInt(4, 12);
    const height = randomInt(3, 10);
    const scale = randomInt(2, 4);
    return numericQuestion(`가로 ${width}, 세로 ${height}인 직사각형을 ${scale}배 확대하면 넓이는?`, width * height * scale * scale, 15);
  },
  () => {
    const a = randomInt(2, 7);
    const b = randomInt(2, 7);
    return { q: `(x+${a})(x+${b})의 상수항은?`, answer: `${a * b}`, wrong: [`${a + b}`, `${a * b + a}`] };
  },
  () => {
    const total = randomInt(5, 12) * 10;
    const rate = [20, 30, 40][randomInt(0, 2)];
    const discount = total * rate / 100;
    return numericQuestion(`${total}원 상품을 ${rate}% 할인한 가격은?`, total - discount, 10);
  }
];

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function numericQuestion(q, answer, gap = 2, suffix = "", allowNegative = false) {
  const correct = Number(answer);
  const wrongValues = new Set();
  while (wrongValues.size < 2) {
    const offset = randomInt(1, Math.max(3, gap)) * (Math.random() < .5 ? -1 : 1);
    const wrong = correct + offset;
    if (wrong !== correct && (allowNegative || wrong >= 0)) wrongValues.add(wrong);
  }
  return { q, answer: `${correct}${suffix}`, wrong: [...wrongValues].map(value => `${value}${suffix}`) };
}

function shuffle(items) {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function prepareQuestion(question) {
  const options = shuffle([
    { text: question.answer, correct: true },
    ...question.wrong.map(text => ({ text, correct: false }))
  ]);
  return {
    q: question.q,
    answers: options.map(option => option.text),
    correct: options.findIndex(option => option.correct)
  };
}

function buildQuestionDeck(recentQuestions = []) {
  const recent = new Set(recentQuestions);
  const sources = [...mathQuestions, ...randomQuestionFactories.flatMap(factory => [factory(), factory(), factory()])];
  const fresh = sources.filter(question => !recent.has(question.q));
  return shuffle(fresh.length >= 12 ? fresh : sources).map(prepareQuestion);
}

const COLORS = {
  cyan: "#37e5d5", lime: "#c6ff38", yellow: "#ffd43b",
  pink: "#ff3d87", player: ["#ff3d87", "#27dbe0"]
};

const audio = { context: null, master: null, enabled: true, timer: null, step: 0 };
const bgmNotes = [
  329.63, 246.94, 261.63, 293.66, 329.63, 293.66, 261.63, 246.94,
  220, 220, 261.63, 329.63, 293.66, 261.63, 246.94, 246.94,
  293.66, 349.23, 440, 392, 349.23, 329.63, 261.63, 329.63
];
const bgmBass = [82.41, 110, 98, 123.47];

function initAudio() {
  if (!audio.context) {
    audio.context = new (window.AudioContext || window.webkitAudioContext)();
    audio.master = audio.context.createGain();
    audio.master.gain.value = .2;
    audio.master.connect(audio.context.destination);
  }
  if (audio.context.state === "suspended") audio.context.resume();
}

function tone(frequency, duration, type = "square", volume = .12, delay = 0) {
  if (!audio.enabled) return;
  initAudio();
  const now = audio.context.currentTime + delay;
  const oscillator = audio.context.createOscillator();
  const gain = audio.context.createGain();
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, now);
  gain.gain.setValueAtTime(volume, now);
  gain.gain.exponentialRampToValueAtTime(.001, now + duration);
  oscillator.connect(gain);
  gain.connect(audio.master);
  oscillator.start(now);
  oscillator.stop(now + duration);
}

function playSfx(name) {
  if (name === "coin") {
    tone(880, .09, "square", .15);
    tone(1320, .15, "square", .12, .07);
  } else if (name === "correct") {
    [523.25, 659.25, 783.99, 1046.5].forEach((note, i) => tone(note, .18, "square", .1, i * .07));
  } else {
    tone(name === "crash" ? 95 : 180, .24, "sawtooth", .16);
    tone(name === "crash" ? 62 : 120, .3, "square", .12, .12);
  }
}

function startBgm() {
  if (!audio.enabled || audio.timer) return;
  initAudio();
  const tick = () => {
    if (!world.running || !audio.enabled) return;
    const step = audio.step++;
    const note = bgmNotes[step % bgmNotes.length];
    tone(note, .105, "square", .048);
    tone(note * 2, .06, "square", .018, .035);
    if (step % 2 === 0) tone(bgmBass[Math.floor(step / 8) % bgmBass.length], .18, "triangle", .055);
    if (step % 8 === 4) tone(note * 1.5, .08, "square", .022);
  };
  tick();
  audio.timer = setInterval(tick, 125);
}

function stopBgm() {
  clearInterval(audio.timer);
  audio.timer = null;
}

function toggleSound() {
  audio.enabled = !audio.enabled;
  const button = document.getElementById("soundButton");
  button.setAttribute("aria-pressed", String(audio.enabled));
  button.textContent = audio.enabled ? "♪ SOUND ON" : "♪ SOUND OFF";
  if (audio.enabled && world.running) startBgm();
  else stopBgm();
}

function newPlayer(index) {
  return {
    index, lane: 1, targetLane: 1, x: 0, lives: 3, score: 0, coins: 0,
    correct: 0, invulnerable: 0, active: true
  };
}

const world = {
  running: false, distance: 0, speed: 1.2, roadOffset: 0,
  obstacles: [], pickups: [], gate: null, questionCount: 0, questionIndex: 0,
  questionDeck: [], recentQuestions: [],
  nextObstacle: 1.2, nextCoin: .8, nextQuestion: 9, lastTime: 0,
  players: [newPlayer(0), newPlayer(1)]
};
let capturePlayerIndex = 0;
let captureStream = null;

function dimensions(canvas) {
  const w = canvas.width;
  const h = canvas.height;
  const roadW = w * .72;
  const roadX = (w - roadW) / 2;
  return { w, h, roadW, roadX, laneW: roadW / 3 };
}

function laneCenter(canvas, lane) {
  const d = dimensions(canvas);
  return d.roadX + d.laneW * (lane + .5);
}

function resizeCanvases() {
  canvases.forEach((canvas, index) => {
    const rect = canvas.getBoundingClientRect();
    const scale = Math.min(devicePixelRatio || 1, 1);
    canvas.width = Math.round(rect.width * scale);
    canvas.height = Math.round(rect.height * scale);
    world.players[index].x = laneCenter(canvas, world.players[index].lane);
  });
  draw();
}

function resetGame() {
  world.running = true;
  world.distance = 0;
  world.speed = 1.2;
  world.roadOffset = 0;
  world.obstacles = [];
  world.pickups = [];
  world.gate = null;
  world.questionCount = 0;
  world.questionIndex = 0;
  world.recentQuestions = [];
  world.questionDeck = buildQuestionDeck();
  world.nextObstacle = 1.3;
  world.nextCoin = .7;
  world.nextQuestion = 8;
  world.lastTime = performance.now();
  world.players = [newPlayer(0), newPlayer(1)];
  world.players.forEach((player, index) => {
    player.x = laneCenter(canvases[index], 1);
    ui.labels[index].textContent = ui.names[index].value.trim() || `PLAYER ${index + 1}`;
    ui.huds[index].classList.remove("hidden");
  });
  ui.start.classList.add("hidden");
  ui.over.classList.add("hidden");
  ui.question.classList.add("hidden");
  updateHud();
  startBgm();
  canvases[0].focus();
  requestAnimationFrame(loop);
}

function movePlayer(index, direction) {
  const player = world.players[index];
  if (!world.running || !player.active) return;
  player.targetLane = Math.max(0, Math.min(2, player.targetLane + direction));
}

function currentStage() {
  return Math.floor(world.distance / 300) + 1;
}

function spawnObstacle() {
  if (world.gate) return;
  const types = [
    { type: "car", w: .3, h: 74, color: "#ff6a3d" },
    { type: "truck", w: .39, h: 116, color: "#37a8e5" },
    { type: "bus", w: .41, h: 130, color: "#f0b72e" },
    { type: "bike", w: .2, h: 62, color: "#e7e7e7" }
  ];
  const firstLane = Math.floor(Math.random() * 3);
  const lanes = [firstLane];
  if (currentStage() >= 5 && Math.random() < .32) lanes.push((firstLane + 1 + Math.floor(Math.random() * 2)) % 3);
  lanes.forEach((lane, index) => {
    const type = types[Math.floor(Math.random() * types.length)];
    world.obstacles.push({ ...type, lane, y: -150 - index * 18, hitBy: [false, false] });
  });
}

function spawnCoin() {
  if (world.gate) return;
  const lane = Math.floor(Math.random() * 3);
  const count = 3 + Math.floor(Math.random() * 3);
  for (let i = 0; i < count; i++) {
    world.pickups.push({ lane, y: -30 - i * 70, spin: Math.random() * 6, collectedBy: [false, false] });
  }
}

function spawnQuestion() {
  if (world.questionIndex >= world.questionDeck.length) {
    world.questionDeck = buildQuestionDeck(world.recentQuestions);
    world.questionIndex = 0;
  }
  const question = world.questionDeck[world.questionIndex++];
  world.recentQuestions.push(question.q);
  if (world.recentQuestions.length > 80) world.recentQuestions.shift();
  world.questionCount++;
  world.obstacles = world.obstacles.filter(item => item.y > canvases[0].height * .6);
  world.pickups = [];
  world.gate = { y: -120, question, resolvedBy: [false, false] };
  document.getElementById("questionTag").textContent = "MATH GATE · BASIC";
  ui.questionText.textContent = question.q;
  ui.question.classList.remove("hidden");
  updateHud();
}

function showToast(index, text, danger = false) {
  const toast = ui.toasts[index];
  toast.textContent = text;
  toast.style.color = danger ? COLORS.pink : COLORS.lime;
  toast.classList.remove("show");
  void toast.offsetWidth;
  toast.classList.add("show");
}

function hitPlayer(index, type) {
  const player = world.players[index];
  if (!player.active || player.invulnerable > 0) return;
  player.lives--;
  player.invulnerable = 1.35;
  playSfx(type);
  showToast(index, type === "wrong" ? "WRONG! -1 LIFE" : "CRASH! -1 LIFE", true);
  if (player.lives <= 0) {
    player.active = false;
    showToast(index, "KNOCK OUT", true);
  }
  if (world.players.every(item => !item.active)) endGame();
}

function update(dt) {
  const motionSpeed = world.speed * (world.gate ? .58 : 1);
  world.distance += dt * 12 * world.speed;
  world.speed = Math.min(2.6, 1.2 + world.distance / 750);
  world.roadOffset = (world.roadOffset + dt * 350 * motionSpeed) % 120;

  world.players.forEach((player, index) => {
    player.invulnerable = Math.max(0, player.invulnerable - dt);
    if (player.active) player.score += dt * 18 * world.speed;
    const target = laneCenter(canvases[index], player.targetLane);
    player.x += (target - player.x) * Math.min(1, dt * 13);
    if (Math.abs(player.x - target) < 2) player.lane = player.targetLane;
  });

  world.nextObstacle -= dt;
  world.nextCoin -= dt;
  world.nextQuestion -= dt * world.speed;
  if (world.nextObstacle <= 0) {
    spawnObstacle();
    world.nextObstacle = (Math.max(.45, 1.45 / world.speed) + Math.random() * .6) * (currentStage() >= 5 ? .82 : 1);
  }
  if (world.nextCoin <= 0) {
    spawnCoin();
    world.nextCoin = 2.6 + Math.random() * 2.2;
  }
  if (world.nextQuestion <= 0 && !world.gate) {
    spawnQuestion();
    world.nextQuestion = 15 + Math.random() * 5;
  }

  world.obstacles.forEach(item => {
    item.y += dt * 270 * motionSpeed;
    world.players.forEach((player, index) => {
      const d = dimensions(canvases[index]);
      const w = d.laneW * item.w;
      if (!item.hitBy[index] && player.active &&
          Math.abs(item.y - (d.h - 110)) < (item.h + 76) / 2 &&
          Math.abs(laneCenter(canvases[index], item.lane) - player.x) < (w + Math.min(54, d.laneW * .28)) / 2) {
        item.hitBy[index] = true;
        hitPlayer(index, "crash");
      }
    });
  });
  world.obstacles = world.obstacles.filter(item => item.y < canvases[0].height + 170);

  world.pickups.forEach(coin => {
    coin.y += dt * 270 * motionSpeed;
    coin.spin += dt * 8;
    world.players.forEach((player, index) => {
      const d = dimensions(canvases[index]);
      if (!coin.collectedBy[index] && player.active &&
          Math.abs(coin.y - (d.h - 110)) < 45 &&
          Math.abs(laneCenter(canvases[index], coin.lane) - player.x) < Math.min(54, d.laneW * .28)) {
        coin.collectedBy[index] = true;
        player.coins++;
        player.score += 100;
        playSfx("coin");
        showToast(index, "COIN +100");
      }
    });
  });
  world.pickups = world.pickups.filter(item => item.y < canvases[0].height + 50);

  if (world.gate) {
    world.gate.y += dt * 230 * motionSpeed;
    if (world.gate.y > canvases[0].height - 145) {
      world.players.forEach((player, index) => {
        if (world.gate.resolvedBy[index] || !player.active) return;
        world.gate.resolvedBy[index] = true;
        if (player.targetLane === world.gate.question.correct) {
          player.correct++;
          player.score += 500;
          playSfx("correct");
          showToast(index, "CORRECT! +500");
        } else {
          hitPlayer(index, "wrong");
        }
      });
      ui.question.classList.add("hidden");
    }
    if (world.gate.y > canvases[0].height + 170) world.gate = null;
  }
  updateHud();
}

function themeState() {
  const themes = [
    { name: "COAST", sky: "#187e9b", ground: "#d5ad61", road: "#29373a" },
    { name: "FOREST", sky: "#173b2b", ground: "#285235", road: "#29332f" },
    { name: "CITY", sky: "#55466a", ground: "#252b3f", road: "#292b38" },
    { name: "SKYWAY", sky: "#65a8cd", ground: "#d7e8eb", road: "#4b5961" },
    { name: "NIGHT CITY", sky: "#071225", ground: "#0b1320", road: "#171d29" }
  ];
  const stage = currentStage();
  const index = Math.min(stage - 1, 4);
  return { stage, theme: themes[index], index };
}

function drawTheme(ctx, d, index) {
  const offset = world.roadOffset;
  ctx.fillStyle = themeState().theme.sky;
  ctx.fillRect(0, 0, d.w, d.h);
  if (index === 0) {
    for (let y = -90 + offset; y < d.h + 90; y += 90) {
      ctx.fillStyle = "#6fd8dd";
      ctx.fillRect(5, y, d.roadX - 26, 6);
      ctx.fillRect(d.roadX + d.roadW + 22, y + 30, d.roadX - 26, 6);
      ctx.fillStyle = "#e8c06c";
      ctx.fillRect(d.roadX - 34, y + 15, 15, 44);
      ctx.fillRect(d.roadX + d.roadW + 19, y + 48, 15, 36);
    }
  } else if (index === 1) {
    for (let y = -100 + offset; y < d.h + 100; y += 105) {
      for (const x of [d.roadX - 45, d.roadX + d.roadW + 32]) {
        ctx.fillStyle = "#543c25"; ctx.fillRect(x, y + 30, 9, 48);
        ctx.fillStyle = "#245d38"; ctx.fillRect(x - 14, y, 38, 43);
        ctx.fillStyle = "#77ad48"; ctx.fillRect(x - 5, y + 6, 22, 10);
      }
    }
  } else if (index === 2 || index === 4) {
    const night = index === 4;
    for (let side = 0; side < 2; side++) {
      const x = side === 0 ? d.roadX - 60 : d.roadX + d.roadW + 10;
      for (let y = -110 + offset; y < d.h + 110; y += 126) {
        ctx.fillStyle = night ? "#111d35" : "#3b3b5b"; ctx.fillRect(x, y, 50, 83);
        ctx.fillStyle = night ? "#ffd859" : "#ffb16d";
        for (let row = 0; row < 3; row++) {
          ctx.fillRect(x + 8, y + 12 + row * 20, 7, 8);
          ctx.fillRect(x + 28, y + 12 + row * 20, 7, 8);
        }
      }
    }
  } else {
    for (let y = -90 + offset; y < d.h + 90; y += 130) {
      ctx.fillStyle = "#f2f8f6";
      ctx.fillRect(5, y, d.roadX - 18, 24);
      ctx.fillRect(d.roadX + d.roadW + 18, y + 45, d.roadX - 22, 28);
    }
  }
}

function drawRoad(ctx, canvas) {
  const d = dimensions(canvas);
  const theme = themeState();
  drawTheme(ctx, d, theme.index);
  ctx.fillStyle = theme.theme.ground;
  ctx.fillRect(d.roadX - 12, 0, d.roadW + 24, d.h);
  ctx.fillStyle = theme.theme.road;
  ctx.fillRect(d.roadX, 0, d.roadW, d.h);
  ctx.fillStyle = "#e7e6d8";
  ctx.fillRect(d.roadX - 4, 0, 4, d.h);
  ctx.fillRect(d.roadX + d.roadW, 0, 4, d.h);
  ctx.fillStyle = "rgba(238,247,239,.65)";
  for (let lane = 1; lane < 3; lane++) {
    const x = d.roadX + d.laneW * lane;
    for (let y = -90 + world.roadOffset; y < d.h; y += 120) ctx.fillRect(x - 2, y, 4, 62);
  }
}

function drawHeadlights(ctx, x, y, w, h, strength = .16) {
  if (currentStage() < 5) return;
  const beam = ctx.createLinearGradient(0, y - h / 2, 0, y - h * 2.8);
  beam.addColorStop(0, `rgba(255,245,174,${strength})`);
  beam.addColorStop(1, "rgba(255,245,174,0)");
  ctx.fillStyle = beam;
  ctx.beginPath();
  ctx.moveTo(x - w * .3, y - h * .34);
  ctx.lineTo(x - w, y - h * 2.8);
  ctx.lineTo(x + w, y - h * 2.8);
  ctx.lineTo(x + w * .3, y - h * .34);
  ctx.fill();
}

function drawVehicle(ctx, x, y, w, h, color, type = "car", player = null) {
  ctx.save();
  if (player && player.invulnerable > 0 && Math.floor(player.invulnerable * 12) % 2 === 0) ctx.globalAlpha = .28;
  ctx.translate(Math.round(x - w / 2), Math.round(y - h / 2));
  ctx.fillStyle = "#050707";
  ctx.fillRect(-4, 12, 4, 18); ctx.fillRect(w, 12, 4, 18);
  ctx.fillRect(-4, h - 30, 4, 18); ctx.fillRect(w, h - 30, 4, 18);
  ctx.fillStyle = color; ctx.fillRect(3, 0, w - 6, h);
  ctx.fillStyle = "#102d36"; ctx.fillRect(7, 18, w - 14, Math.max(13, h * .2));
  ctx.fillStyle = "rgba(255,255,255,.25)"; ctx.fillRect(9, 4, w - 18, 5);
  if (type === "truck") {
    ctx.fillStyle = "#cbd8d7"; ctx.fillRect(6, h * .5, w - 12, h * .4);
  } else if (type === "bus") {
    for (let yy = 47; yy < h - 15; yy += 20) {
      ctx.fillStyle = "#173e48"; ctx.fillRect(6, yy, w - 12, 11);
    }
  } else if (type === "bike") {
    ctx.fillStyle = "#111"; ctx.fillRect(w / 2 - 3, 5, 6, h - 10);
    ctx.fillStyle = "#f5d346"; ctx.fillRect(w / 2 - 7, h * .38, 14, 17);
  }
  ctx.fillStyle = currentStage() >= 5 ? "#fff4a8" : "#ffd7b2";
  ctx.fillRect(5, 3, 7, 5); ctx.fillRect(w - 12, 3, 7, 5);
  ctx.fillStyle = "#ff334d"; ctx.fillRect(5, h - 7, 7, 4); ctx.fillRect(w - 12, h - 7, 7, 4);
  if (player) {
    ctx.fillStyle = "#071113"; ctx.fillRect(7, h * .58, w - 14, 17);
    ctx.fillStyle = player.index === 0 ? COLORS.lime : "#fff";
    ctx.font = `bold ${Math.max(8, w * .18)}px monospace`;
    ctx.textAlign = "center"; ctx.fillText(`${player.index + 1}P`, w / 2, h * .7);
  }
  ctx.restore();
}

function drawCoin(ctx, canvas, coin) {
  const x = laneCenter(canvas, coin.lane);
  const width = 7 + Math.abs(Math.sin(coin.spin)) * 11;
  ctx.fillStyle = "#6f4a00"; ctx.fillRect(x - width / 2 - 2, coin.y - 16, width + 4, 32);
  ctx.fillStyle = COLORS.yellow; ctx.fillRect(x - width / 2, coin.y - 13, width, 26);
}

function drawGate(ctx, canvas, player) {
  if (!world.gate) return;
  const d = dimensions(canvas);
  for (let lane = 0; lane < 3; lane++) {
    const left = d.roadX + d.laneW * lane + 5;
    const width = d.laneW - 10;
    ctx.fillStyle = "rgba(5,12,14,.94)"; ctx.fillRect(left, world.gate.y - 34, width, 90);
    ctx.fillStyle = lane === player.targetLane ? COLORS.lime : COLORS.cyan;
    ctx.fillRect(left, world.gate.y - 42, width, 7);
    ctx.fillRect(left, world.gate.y - 34, 6, 98);
    ctx.fillRect(left + width - 6, world.gate.y - 34, 6, 98);
    ctx.textAlign = "center";
    ctx.fillStyle = "#fff";
    ctx.font = `800 ${Math.min(22, d.laneW * .18)}px "Gothic A1"`;
    ctx.fillText(world.gate.question.answers[lane], left + width / 2, world.gate.y + 25);
  }
}

function drawPlayerView(index) {
  const canvas = canvases[index];
  const ctx = contexts[index];
  const player = world.players[index];
  const d = dimensions(canvas);
  drawRoad(ctx, canvas);
  world.pickups.forEach(coin => {
    if (!coin.collectedBy[index]) drawCoin(ctx, canvas, coin);
  });
  world.obstacles.forEach(item => {
    const w = d.laneW * item.w;
    drawHeadlights(ctx, laneCenter(canvas, item.lane), item.y, w, item.h, .1);
    drawVehicle(ctx, laneCenter(canvas, item.lane), item.y, w, item.h, item.color, item.type);
  });
  drawGate(ctx, canvas, player);
  if (player.active) {
    const playerW = Math.min(50, d.laneW * .34);
    drawHeadlights(ctx, player.x, d.h - 110, playerW, 86, .26);
    drawVehicle(ctx, player.x, d.h - 110, playerW, 86, COLORS.player[index], "car", player);
  }
  if (currentStage() >= 5) {
    const shade = ctx.createLinearGradient(0, 0, 0, d.h * .48);
    shade.addColorStop(0, "rgba(0,2,10,.68)");
    shade.addColorStop(1, "rgba(0,2,10,0)");
    ctx.fillStyle = shade; ctx.fillRect(0, 0, d.w, d.h * .5);
  }
}

function draw() {
  drawPlayerView(0);
  drawPlayerView(1);
}

function updateHud() {
  world.players.forEach((player, index) => {
    ui.scores[index].textContent = Math.floor(player.score).toLocaleString();
    ui.coins[index].textContent = player.coins;
    ui.lives[index].textContent = `${"♥".repeat(player.lives)}${"♡".repeat(3 - player.lives)}`;
    ui.correct[index].textContent = player.correct;
    ui.questions[index].textContent = world.questionCount;
  });
  ui.distance.textContent = String(Math.floor(world.distance)).padStart(4, "0");
  const theme = themeState();
  ui.stage.textContent = `STAGE ${String(theme.stage).padStart(2, "0")} · ${theme.theme.name} · ${world.speed.toFixed(1)}X`;
}

function loop(time) {
  if (!world.running) return draw();
  const dt = Math.min(.035, (time - world.lastTime) / 1000 || 0);
  world.lastTime = time;
  update(dt);
  draw();
  if (world.running) requestAnimationFrame(loop);
}

function endGame() {
  world.running = false;
  stopBgm();
  ui.question.classList.add("hidden");
  const names = ui.names.map((input, index) => input.value.trim() || `PLAYER ${index + 1}`);
  document.getElementById("finalName1").textContent = names[0];
  document.getElementById("finalName2").textContent = names[1];
  document.getElementById("finalScore1").textContent = Math.floor(world.players[0].score).toLocaleString();
  document.getElementById("finalScore2").textContent = Math.floor(world.players[1].score).toLocaleString();
  document.getElementById("finalMath1").textContent = `${world.players[0].correct}/${world.questionCount}`;
  document.getElementById("finalMath2").textContent = `${world.players[1].correct}/${world.questionCount}`;
  const difference = world.players[0].score - world.players[1].score;
  document.getElementById("winnerText").textContent = difference === 0 ? "DRAW" : difference > 0 ? "1P WIN!" : "2P WIN!";
  document.getElementById("captureConsent1").disabled = false;
  document.getElementById("captureConsent2").disabled = false;
  document.getElementById("captureConsent1").textContent = "📷 촬영 동의";
  document.getElementById("captureConsent2").textContent = "📷 촬영 동의";
  ui.over.classList.remove("hidden");
  saveScores();
}

function getScores() {
  try { return JSON.parse(localStorage.getItem("mathHighwayScores")) || []; }
  catch { return []; }
}

function saveScores() {
  const scores = getScores();
  world.players.forEach((player, index) => scores.push({
    name: ui.names[index].value.trim() || `PLAYER ${index + 1}`,
    score: Math.floor(player.score),
    distance: Math.floor(world.distance),
    total: Math.floor(player.score) + Math.floor(world.distance)
  }));
  scores.forEach(item => {
    item.total = Number.isFinite(item.total) ? item.total : (Number(item.score) || 0) + (Number(item.distance) || 0);
  });
  scores.sort((a, b) => b.total - a.total);
  localStorage.setItem("mathHighwayScores", JSON.stringify(scores.slice(0, 8)));
  renderBoard();
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
  })[char]);
}

function renderBoard() {
  const scores = getScores();
  if (!scores.length) {
    ui.board.innerHTML = '<li class="empty-rank">첫 번째 주행 기록을 기다리고 있습니다.</li>';
    return;
  }
  const ranked = scores.map(item => ({
    ...item,
    total: Number.isFinite(item.total) ? item.total : (Number(item.score) || 0) + (Number(item.distance) || 0)
  })).sort((a, b) => b.total - a.total);
  ui.board.innerHTML = ranked.map(item => `
    <li><span class="rank-name">${escapeHtml(item.name)}</span><span class="rank-total">${item.total.toLocaleString()} TOTAL</span></li>
  `).join("");
}

function getCaptures() {
  try { return JSON.parse(localStorage.getItem("mathHighwayCaptures")) || []; }
  catch { return []; }
}

function renderCaptures() {
  const captures = getCaptures();
  if (!captures.length) {
    ui.gallery.innerHTML = '<p class="empty-capture">아직 캡처 기록이 없습니다.</p>';
    return;
  }
  ui.gallery.innerHTML = captures.map((item, index) => `
    <button class="capture-card" type="button" data-capture-index="${index}">
      <img src="${item.image}" alt="${escapeHtml(item.name)} 명예의 캡처">
      <span>${escapeHtml(item.name)} · ${item.total.toLocaleString()} TOTAL</span>
    </button>
  `).join("");
}

function stopCaptureStream() {
  if (captureStream) captureStream.getTracks().forEach(track => track.stop());
  captureStream = null;
  ui.captureVideo.srcObject = null;
}

function closeCaptureModal() {
  stopCaptureStream();
  ui.captureModal.classList.add("hidden");
}

async function openCaptureModal(index) {
  capturePlayerIndex = index;
  const player = world.players[index];
  const name = ui.names[index].value.trim() || `PLAYER ${index + 1}`;
  const score = Math.floor(player.score);
  const distance = Math.floor(world.distance);
  document.getElementById("captureTitle").textContent = `${index + 1}P 명예의 캡처`;
  document.getElementById("captureOverlayName").textContent = name;
  document.getElementById("captureOverlayScore").textContent = `SCORE ${score.toLocaleString()} · TOTAL ${(score + distance).toLocaleString()}`;
  document.getElementById("captureOverlayDistance").textContent = `${distance.toLocaleString()} M`;
  ui.captureStatus.textContent = "카메라 권한을 허용하면 촬영 준비가 시작됩니다.";
  document.getElementById("captureStart").disabled = true;
  ui.captureModal.classList.remove("hidden");

  try {
    captureStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user", width: 640, height: 480 }, audio: false });
    ui.captureVideo.srcObject = captureStream;
    await ui.captureVideo.play();
    ui.captureStatus.textContent = "화면의 정보 패널이 얼굴 일부를 가린 상태로 저장됩니다.";
    document.getElementById("captureStart").disabled = false;
  } catch {
    ui.captureStatus.textContent = "카메라 권한이 허용되지 않았습니다. 촬영하지 않고 닫을 수 있습니다.";
  }
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function capturePhoto() {
  if (!captureStream) return;
  const button = document.getElementById("captureStart");
  button.disabled = true;
  ui.captureCountdown.classList.remove("hidden");
  for (const count of [3, 2, 1]) {
    ui.captureCountdown.textContent = count;
    await wait(700);
  }
  ui.captureCountdown.textContent = "CAPTURE!";
  await wait(220);

  const width = 480;
  const height = 360;
  const output = document.createElement("canvas");
  output.width = width;
  output.height = height;
  const out = output.getContext("2d");
  out.save();
  out.translate(width, 0);
  out.scale(-1, 1);
  out.drawImage(ui.captureVideo, 0, 0, width, height);
  out.restore();

  const player = world.players[capturePlayerIndex];
  const name = ui.names[capturePlayerIndex].value.trim() || `PLAYER ${capturePlayerIndex + 1}`;
  const score = Math.floor(player.score);
  const distance = Math.floor(world.distance);
  const total = score + distance;

  out.fillStyle = "rgba(3,12,14,.72)";
  out.fillRect(0, 0, width, 90);
  out.fillRect(0, height - 88, width, 88);
  out.fillStyle = "rgba(3,12,14,.62)";
  out.fillRect(45, 130, width - 90, 105);
  out.textAlign = "center";
  out.fillStyle = capturePlayerIndex === 0 ? COLORS.pink : COLORS.cyan;
  out.font = "bold 18px monospace";
  out.fillText(`${capturePlayerIndex + 1}P · HALL OF FAME`, width / 2, 32);
  out.fillStyle = "#c6ff38";
  out.font = "bold 34px sans-serif";
  out.fillText(name, width / 2, 185);
  out.fillStyle = "#fff";
  out.font = "bold 18px monospace";
  out.fillText(`SCORE ${score.toLocaleString()}`, width / 2, 215);
  out.fillText(`${distance.toLocaleString()} M  ·  TOTAL ${total.toLocaleString()}`, width / 2, height - 42);

  const captures = getCaptures();
  captures.unshift({ name, score, distance, total, image: output.toDataURL("image/jpeg", .62) });
  localStorage.setItem("mathHighwayCaptures", JSON.stringify(captures.slice(0, 6)));
  renderCaptures();
  document.getElementById(`captureConsent${capturePlayerIndex + 1}`).disabled = true;
  document.getElementById(`captureConsent${capturePlayerIndex + 1}`).textContent = "✓ 촬영 완료";
  ui.captureCountdown.classList.add("hidden");
  closeCaptureModal();
}

document.getElementById("startButton").addEventListener("click", resetGame);
document.getElementById("retryButton").addEventListener("click", resetGame);
document.getElementById("soundButton").addEventListener("click", toggleSound);
document.getElementById("leftButton1").addEventListener("pointerdown", () => movePlayer(0, -1));
document.getElementById("rightButton1").addEventListener("pointerdown", () => movePlayer(0, 1));
document.getElementById("leftButton2").addEventListener("pointerdown", () => movePlayer(1, -1));
document.getElementById("rightButton2").addEventListener("pointerdown", () => movePlayer(1, 1));
document.getElementById("captureConsent1").addEventListener("click", () => openCaptureModal(0));
document.getElementById("captureConsent2").addEventListener("click", () => openCaptureModal(1));
document.getElementById("captureStart").addEventListener("click", capturePhoto);
document.getElementById("captureClose").addEventListener("click", closeCaptureModal);
document.getElementById("photoClose").addEventListener("click", () => document.getElementById("photoModal").classList.add("hidden"));
ui.gallery.addEventListener("click", event => {
  const card = event.target.closest("[data-capture-index]");
  if (!card) return;
  const capture = getCaptures()[Number(card.dataset.captureIndex)];
  if (!capture) return;
  document.getElementById("photoLarge").src = capture.image;
  document.getElementById("photoModal").classList.remove("hidden");
});
document.getElementById("clearButton").addEventListener("click", () => {
  localStorage.removeItem("mathHighwayScores");
  localStorage.removeItem("mathHighwayCaptures");
  renderBoard();
  renderCaptures();
});

window.addEventListener("keydown", event => {
  if (["ArrowLeft", "ArrowRight", "KeyA", "KeyD", "Space"].includes(event.code)) event.preventDefault();
  if (event.code === "KeyA") movePlayer(0, -1);
  if (event.code === "KeyD") movePlayer(0, 1);
  if (event.code === "ArrowLeft") movePlayer(1, -1);
  if (event.code === "ArrowRight") movePlayer(1, 1);
  if ((event.code === "Space" || event.code === "Enter") && !world.running &&
      !ui.names.includes(document.activeElement)) resetGame();
});

window.addEventListener("resize", resizeCanvases);
resizeCanvases();
renderBoard();
renderCaptures();
updateHud();
draw();
