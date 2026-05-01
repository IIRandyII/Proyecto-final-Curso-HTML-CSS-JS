let selectedDifficulty = null;
let selectedCards = null;
let selectedAvatar = null;

// SELECCIÓN DIFICULTAD
document.querySelectorAll(".difficulty-card").forEach(card => {
  card.addEventListener("click", () => {
    document.querySelectorAll(".difficulty-card").forEach(c => c.classList.remove("active"));
    card.classList.add("active");
    selectedDifficulty = card.dataset.value;
  });
});

// SELECCIÓN CARTAS
document.querySelectorAll("#cards button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("#cards button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedCards = parseInt(btn.dataset.value);
  });
});

// SELECCIÓN AVATAR
document.querySelectorAll("#avatar img").forEach(img => {
  img.addEventListener("click", () => {
    document.querySelectorAll("#avatar img").forEach(i => i.classList.remove("active"));
    img.classList.add("active");
    selectedAvatar = img.dataset.value;
  });
});

// FORMULARIO
document.getElementById("playerForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const player = {
    nick: document.getElementById("nick").value,
    difficulty: selectedDifficulty,
    cards: selectedCards,
    avatar: selectedAvatar
  };

  localStorage.setItem("playerData", JSON.stringify(player));

  window.location.href = "game.html";
});