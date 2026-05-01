const player = JSON.parse(localStorage.getItem("playerData"));

const board = document.getElementById("board");
const movesText = document.getElementById("moves");
const scoreText = document.getElementById("score");
const remainingText = document.getElementById("remaining");

// NOMBRE Y AVATAR
document.getElementById("playerName").textContent = player.nick;
document.getElementById("playerAvatar").src = `img/avatars/${player.avatar}`;

// GRID
board.style.display = "grid";
board.style.gap = "12px";
board.style.justifyContent = "center";

// DORSO
const cardBack = "img/cards/one_piece_card_back.png";

// IMÁGENES CON DATOS DE CADA PERSONAJE
const images = [
  { src: "img/cards/doflamingo_card.jpg", tipo: "VILLANO", nombre: "Doflamingo", color: "#ff85d0", border: "#8b2d6e", bg: "#2d1020" },
  { src: "img/cards/kaido_card.jpg",      tipo: "VILLANO", nombre: "Kaido",      color: "#c9a0ff", border: "#4a2d7a", bg: "#1a1030" },
  { src: "img/cards/bigmom_card.jpg",     tipo: "VILLANO", nombre: "Big Mom",    color: "#ff85aa", border: "#9a3060", bg: "#2d0f1a" },
  { src: "img/cards/luffy_card.jpg",      tipo: "HÉROE",   nombre: "Luffy",      color: "#ff8866", border: "#c0392b", bg: "#2d1008" },
  { src: "img/cards/zoro_card.jpg",       tipo: "HÉROE",   nombre: "Zoro",       color: "#66ff88", border: "#1a6b2a", bg: "#0f2d14" },
  { src: "img/cards/law_card.jpg",        tipo: "HÉROE",   nombre: "Law",        color: "#66ccff", border: "#1a5a7a", bg: "#0f1e2d" },
  { src: "img/cards/sanji_card.jpeg",     tipo: "HÉROE",   nombre: "Sanji",      color: "#ffe566", border: "#7a6b10", bg: "#2d280f" },
  { src: "img/cards/nami_card.jpg",    tipo: "HÉROE",   nombre: "Nami",    color: "#ffaa44", border: "#cc7700", bg: "#2d1f08" },
  { src: "img/cards/teach_card.jpg",   tipo: "VILLANO", nombre: "Teach",   color: "#aa88ff", border: "#3a1a6b", bg: "#150a2d" },
  { src: "img/cards/ace_card.jpg",     tipo: "HÉROE",   nombre: "Ace",     color: "#ff6633", border: "#aa2200", bg: "#2d0f08" },
  { src: "img/cards/chopper_card.jpg", tipo: "HÉROE",   nombre: "Chopper", color: "#ff99cc", border: "#cc3377", bg: "#2d0f1a" },
];

// SELECCIÓN SEGÚN TAMAÑO
let selected = images.slice(0, player.cards / 2);
let cards = [...selected, ...selected];

// MEZCLAR
cards.sort(() => Math.random() - 0.5);

// VARIABLES
let first = null;
let second = null;
let lock = false;
let moves = 0;
let score = 0;

// MOVIMIENTOS SEGÚN DIFICULTAD
let maxMoves = {
  easy: 30,
  medium: 20,
  hard: 12
}[player.difficulty];

// INICIALIZAR CONTADORES
movesText.textContent = moves;
remainingText.textContent = maxMoves;
scoreText.textContent = score;

// TIEMPO SEGÚN DIFICULTAD
function getTime() {
  return {
    easy: 1500,
    medium: 1000,
    hard: 500
  }[player.difficulty];
}

// CREAR TABLERO
cards.forEach((card) => {
  const el = document.createElement("div");
  el.classList.add("card");

  // guardamos los datos del personaje en el elemento
  el.dataset.src    = card.src;
  el.dataset.nombre = card.nombre;
  el.dataset.tipo   = card.tipo;
  el.dataset.color  = card.color;
  el.dataset.border = card.border;
  el.dataset.bg     = card.bg;

  // empieza boca abajo
  el.innerHTML = `<img src="${cardBack}">`;
  el.addEventListener("click", flip);
  board.appendChild(el);
});

// VOLTEAR
function flip() {
  if (lock || this === first) return;

  const { src, nombre, tipo, color, border, bg } = this.dataset;

  // aplicar estilo de carta volteada
  this.style.border = `2px solid ${border}`;
  this.style.borderRadius = "12px";
  this.style.background = bg;

  this.innerHTML = `
  <div style="position:relative; width:100%; height:100%;">
    <div style="font-family:'Cinzel',serif; font-size:9px; font-weight:700; letter-spacing:2px;
      text-align:center; padding:5px 0; background:${border}; color:${color}; text-transform:uppercase;
      position:absolute; top:0; left:0; right:0; z-index:2;">
      ${tipo}
    </div>
    <img src="${src}" style="width:100%; height:100%; object-fit:cover; object-position:top; display:block;">
    <div style="font-family:'Cinzel',serif; font-size:11px; font-weight:700; text-align:center;
      padding:7px 4px; color:${color}; background:${border}cc;
      position:absolute; bottom:0; left:0; right:0; z-index:2;">
      ${nombre}
    </div>
  </div>
`;

  if (!first) {
    first = this;
  } else {
    second = this;
    check();
  }
}

// CHECK MATCH
function check() {
  lock = true;
  moves++;
  movesText.textContent = moves;
  remainingText.textContent = maxMoves - moves;

  if (first.dataset.src === second.dataset.src) {
    score++;
    scoreText.textContent = score;
    first.classList.add("matched");
    second.classList.add("matched");
    reset();
    checkWin();
  } else {
    setTimeout(() => {
      // volver al dorso y limpiar estilos
      first.innerHTML = `<img src="${cardBack}">`;
      first.style.border = "";
      first.style.background = "";
      second.innerHTML = `<img src="${cardBack}">`;
      second.style.border = "";
      second.style.background = "";
      reset();
    }, getTime());
  }

  if (moves >= maxMoves) {
    setTimeout(() => showModal(false), 300);
  }
}

// RESET TURNO
function reset() {
  first = null;
  second = null;
  lock = false;
}

// GANAR
function checkWin() {
  const allMatched = document.querySelectorAll(".card.matched").length === cards.length;
  if (allMatched) {
    setTimeout(() => showModal(true), 300);
  }
}

// MODAL
function showModal(win) {
  const overlay = document.getElementById("modalOverlay");
  const icon = document.getElementById("modalIcon");
  const title = document.getElementById("modalTitle");
  const subtitle = document.getElementById("modalSubtitle");

  if (win) {
    icon.textContent = "🏆";
    title.textContent = "¡Victoria!";
    subtitle.textContent = `Emparejaste todas las cartas con ${moves} tiradas y ${score} puntos. ¡Eres un gran pirata!`;
  } else {
    icon.textContent = "💀";
    title.textContent = "Derrotado";
    subtitle.textContent = `Te quedaste sin tiradas. Conseguiste ${score} puntos. ¡El Grand Line no perdona!`;
  }

  overlay.style.display = "flex";
}