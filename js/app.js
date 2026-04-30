document.getElementById("playerForm").addEventListener("submit", (e) => {
  e.preventDefault();

  const player = {
    nick: document.getElementById("nick").value,
    difficulty: document.getElementById("difficulty").value,
    cards: parseInt(document.getElementById("cards").value),
    avatar: document.getElementById("avatar").value
  };

  localStorage.setItem("playerData", JSON.stringify(player));

  window.location.href = "game.html";
});