const player = JSON.parse(localStorage.getItem("playerData"));

const board = document.getElementById("board");
const movesText = document.getElementById("moves");
const scoreText = document.getElementById("score");
const remainingText = document.getElementById("remaining");

// NOMBRE Y AVATAR
document.getElementById("playerName").textContent = player.nick;
document.getElementById("playerAvatar").src = `img/avatars/${player.avatar}`;


// CONFIG GRID
const cols = {
  12: 3,
  16: 4,
  24: 4
}[player.cards];

board.style.gridTemplateColumns = `repeat(${cols}, 100px)`;

// IMÁGENES
const images = [
  "img/cards/luffy_card.png",
  "img/cards/zoro_card.png",
  "img/cards/kaido_card.png",
  "img/cards/doflamingo_card.png",
  "img/cards/usopp_card.png",
  "img/cards/bigmom_card.png"
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
cards.forEach((img) => {
  const card = document.createElement("div");
  card.classList.add("card");
  card.dataset.image = img;

  card.innerHTML = `<img src="img/cards/one_piece_card_back.png">`;

  // CLICK
  card.addEventListener("click", flip);

  // DRAG
  card.setAttribute("draggable", true);
  card.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text", img);
  });

  board.appendChild(card);
});

// VOLTEAR
function flip() {
  if (lock || this === first) return;

  this.innerHTML = `<img src="${this.dataset.image}">`;

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

  if (first.dataset.image === second.dataset.image) {
   score++;
    scoreText.textContent = score;
    first.classList.add("matched");
    second.classList.add("matched");
    reset();
    checkWin();
  } else {
    setTimeout(() => {
      first.innerHTML = `<img src="img/cards/one_piece_card_back.png">`;
      second.innerHTML = `<img src="img/cards/one_piece_card_back.png">`;
      reset();
    }, getTime());
  }

   if (moves >= maxMoves) {
    setTimeout(() => alert("Perdiste 😢"), 300);
  }
}

//Reset
function reset() {
  first = null;
  second = null;
  lock = false;
}

//Ganar
function checkWin() {
  const allMatched = document.querySelectorAll(".card.matched").length === cards.length;
  if (allMatched) {
    setTimeout(() => alert("Ganaste 🎉"), 300);
  }
}