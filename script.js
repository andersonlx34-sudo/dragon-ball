// Banco de dados de imagens dos personagens (Imagens Transparentes HD)
const CHARACTERS = [
  { name: 'Goku', img: 'https://i.pinimg.com/736x/05/2c/d2/052cd2b6b56a59ba40d3d932da1b3d67.jpg' },
  { name: 'Vegeta', img: 'https://i.pinimg.com/736x/05/2c/d2/052cd2b6b56a59ba40d3d932da1b3d67.jpg' },
  { name: 'Gohan', img: 'https://i.scdn.co/image/ab67616d0000b273b61e8c7225f683a0ac934be4' },
  { name: 'Piccolo', img: 'https://thumb.wikimedia.org/wikipedia/pt/thumb/d/d1/Piccolo_Jr.jpg/250px-Piccolo_Jr.jpg?utm_source=pt.wikipedia.org&utm_campaign=parser&utm_content=thumbnail' },
  { name: 'Trunks', img: 'https://i.pinimg.com/736x/85/6b/80/856b80a55d0d1d07e114b41bd50cd8e4.jpg' },
  { name: 'Freeza', img: 'https://p2.trrsf.com/image/fget/cf/1200/1200/middle/images.terra.com/2025/02/26/freeza-dourado-dbbreakers-qe73eezxey44.jpg' },
  { name: 'Cell', img: 'https://i.pinimg.com/736x/7f/f7/ca/7ff7ca5274f377fc7b533af7aac41340.jpg' },
  { name: 'Majin Boo', img: 'https://i1.sndcdn.com/artworks-KmTnfKaqRlh2xKwy-77nEDA-t500x500.jpg' },
  { name: 'Goku Black', img: 'https://static.wikitide.net/deathbattlewiki/d/d3/Portrait.gokublack.png' },
  { name: 'Gogeta', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTxP5PY286XxpdAB7Gp9qBJG0tEQGBUKm91UeRni9onJM49ndr_-6Fcvbg&s=10' },
  { name: 'Bardock', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRm_XYWViEeJ7P-0C_jSCSvXQrwIC3a6l9IzhTMHBB2nQ&s=10' },
  { name: 'Broly', img: 'https://wallpapers.com/images/featured/papel-de-parede-para-celular-gratis-dragon-ball-super-broly-dznz07vkati6shws.jpg' }
];

// Estado do Jogo
let gameState = {
  difficulty: 'easy',
  pairsCount: 4,
  playersCount: 1,
  players: [],
  currentPlayerIndex: 0,
  moves: 0,
  flippedCards: [],
  matchedPairs: 0,
  isLockBoard: false,
  timer: null,
  secondsElapsed: 0,
  gameStarted: false
};

// Bootstrap Modals Instance Store
let configModalInstance = null;
let victoryModalInstance = null;

function getConfigModal() {
  if (!configModalInstance) {
    const el = document.getElementById('configModal');
    if (el) configModalInstance = new bootstrap.Modal(el);
  }
  return configModalInstance;
}

function getVictoryModal() {
  if (!victoryModalInstance) {
    const el = document.getElementById('victoryModal');
    if (el) victoryModalInstance = new bootstrap.Modal(el);
  }
  return victoryModalInstance;
}

// Inicialização após carregamento
document.addEventListener('DOMContentLoaded', () => {
  setupEventListeners();
  renderPlayerInputs(1);
  startNewGame();
});

// Registrar Eventos
function setupEventListeners() {
  // Alteração no formulário de quantidade de jogadores
  document.querySelectorAll('input[name="playerCount"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      renderPlayerInputs(parseInt(e.target.value));
    });
  });

  // Botão Iniciar no Modal
  document.getElementById('btnStartGame').addEventListener('click', () => {
    readConfigAndStart();
    const modal = getConfigModal();
    if (modal) modal.hide();
  });

  // Botão Jogar Novamente
  document.getElementById('btnPlayAgain').addEventListener('click', () => {
    const modal = getVictoryModal();
    if (modal) modal.hide();
    startNewGame();
  });
}

// Renderizar campos para nomes dos jogadores
function renderPlayerInputs(count) {
  const container = document.getElementById('playerNamesInputs');
  container.innerHTML = '';
  for (let i = 1; i <= count; i++) {
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'form-control bg-dark text-light border-secondary';
    input.placeholder = `Nome do Jogador ${i}`;
    input.value = `Jogador ${i}`;
    input.dataset.playerIndex = i - 1;
    container.appendChild(input);
  }
}

// Ler configurações e iniciar
function readConfigAndStart() {
  const diff = document.querySelector('input[name="difficulty"]:checked').value;
  const pCount = parseInt(document.querySelector('input[name="playerCount"]:checked').value);
  
  const playerInputs = document.querySelectorAll('#playerNamesInputs input');
  const players = [];
  playerInputs.forEach((input, idx) => {
    players.push({
      id: idx,
      name: input.value.trim() || `Jogador ${idx + 1}`,
      score: 0
    });
  });

  gameState.difficulty = diff;
  gameState.playersCount = pCount;
  gameState.players = players;
  
  if (diff === 'easy') gameState.pairsCount = 4;
  else if (diff === 'medium') gameState.pairsCount = 8;
  else if (diff === 'hard') gameState.pairsCount = 12;

  startNewGame();
}

// Inicializar Nova Partida
function startNewGame() {
  // Resetar Estados
  gameState.currentPlayerIndex = 0;
  gameState.moves = 0;
  gameState.matchedPairs = 0;
  gameState.flippedCards = [];
  gameState.isLockBoard = false;
  gameState.gameStarted = false;
  
  if (gameState.players.length === 0) {
    gameState.players = [{ id: 0, name: 'Goku', score: 0 }];
  } else {
    gameState.players.forEach(p => p.score = 0);
  }

  // Timer Reset
  clearInterval(gameState.timer);
  gameState.secondsElapsed = 0;
  document.getElementById('timer').textContent = '00:00';
  document.getElementById('moves').textContent = '0';

  // Renderizar Placar de Jogadores
  renderPlayersBoard();

  // Gerar e Renderizar Cartas
  renderCards();
}

// Iniciar Cronômetro
function startTimer() {
  gameState.gameStarted = true;
  gameState.timer = setInterval(() => {
    gameState.secondsElapsed++;
    const mins = String(Math.floor(gameState.secondsElapsed / 60)).padStart(2, '0');
    const secs = String(gameState.secondsElapsed % 60).padStart(2, '0');
    document.getElementById('timer').textContent = `${mins}:${secs}`;
  }, 1000);
}

// Renderizar painel de placar dos jogadores
function renderPlayersBoard() {
  const board = document.getElementById('playersBoard');
  board.innerHTML = '';

  gameState.players.forEach((player, idx) => {
    const badge = document.createElement('div');
    badge.className = `player-badge ${idx === gameState.currentPlayerIndex ? 'active' : ''}`;
    badge.id = `player-badge-${idx}`;
    badge.innerHTML = `
      <div class="small text-truncate" style="max-width: 90px;">${player.name}</div>
      <div class="fw-bold text-warning fs-5"><span id="score-${idx}">${player.score}</span> pts</div>
    `;
    board.appendChild(badge);
  });
}

// Atualizar Placar Visualmente
function updateScoreboard() {
  gameState.players.forEach((p, idx) => {
    const scoreEl = document.getElementById(`score-${idx}`);
    if (scoreEl) scoreEl.textContent = p.score;
    
    const badgeEl = document.getElementById(`player-badge-${idx}`);
    if (badgeEl) {
      if (idx === gameState.currentPlayerIndex) {
        badgeEl.classList.add('active');
      } else {
        badgeEl.classList.remove('active');
      }
    }
  });
}

// Criar e Renderizar Tabuleiro
function renderCards() {
  const grid = document.getElementById('gameGrid');
  grid.innerHTML = '';
  grid.className = `game-grid grid-${gameState.difficulty} mx-auto`;

  // Seleciona a quantidade necessária de personagens
  const selectedChars = CHARACTERS.slice(0, gameState.pairsCount);
  // Duplica e embaralha
  const deck = [...selectedChars, ...selectedChars].sort(() => Math.random() - 0.5);

  deck.forEach((char, index) => {
    const card = document.createElement('div');
    card.className = 'card-item';
    card.dataset.name = char.name;
    card.dataset.index = index;

    card.innerHTML = `
      <div class="card-face card-back">
        <div class="dragon-ball-icon">
          <div class="star-container">
            <i class="fa-solid fa-star star"></i>
            <i class="fa-solid fa-star star"></i>
            <i class="fa-solid fa-star star"></i>
            <i class="fa-solid fa-star star"></i>
          </div>
        </div>
      </div>
      <div class="card-face card-front">
        <img src="${char.img}" alt="${char.name}" loading="lazy">
      </div>
    `;

    card.addEventListener('click', () => onCardClick(card));
    grid.appendChild(card);
  });
}

// Clique na Carta
function onCardClick(card) {
  if (gameState.isLockBoard) return;
  if (card.classList.contains('flipped') || card.classList.contains('matched')) return;

  if (!gameState.gameStarted) {
    startTimer();
  }

  card.classList.add('flipped');
  gameState.flippedCards.push(card);

  if (gameState.flippedCards.length === 2) {
    checkMatch();
  }
}

// Verificar combinação de par
function checkMatch() {
  gameState.isLockBoard = true;
  gameState.moves++;
  document.getElementById('moves').textContent = gameState.moves;

  const [card1, card2] = gameState.flippedCards;
  const isMatch = card1.dataset.name === card2.dataset.name;

  if (isMatch) {
    setTimeout(() => {
      card1.classList.add('matched');
      card2.classList.add('matched');
      
      // Pontuação para o jogador atual
      gameState.players[gameState.currentPlayerIndex].score += 10;
      gameState.matchedPairs++;
      
      updateScoreboard();
      resetTurn();

      // Verificar Fim de Jogo
      if (gameState.matchedPairs === gameState.pairsCount) {
        endGame();
      }
    }, 400);
  } else {
    card1.classList.add('wrong');
    card2.classList.add('wrong');

    setTimeout(() => {
      card1.classList.remove('flipped', 'wrong');
      card2.classList.remove('flipped', 'wrong');

      // Trocar Vez do Jogador
      if (gameState.playersCount > 1) {
        gameState.currentPlayerIndex = (gameState.currentPlayerIndex + 1) % gameState.playersCount;
      }

      updateScoreboard();
      resetTurn();
    }, 1000);
  }
}

function resetTurn() {
  gameState.flippedCards = [];
  gameState.isLockBoard = false;
}

// Fim de Partida
function endGame() {
  clearInterval(gameState.timer);

  // Soltar Confetes
  if (typeof confetti === 'function') {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 }
    });
  }

  // Determinar Vencedor(es)
  const sortedPlayers = [...gameState.players].sort((a, b) => b.score - a.score);
  const highestScore = sortedPlayers[0].score;
  const winners = sortedPlayers.filter(p => p.score === highestScore);

  const victoryDetails = document.getElementById('victoryDetails');
  
  if (gameState.playersCount === 1) {
    victoryDetails.innerHTML = `
      <p class="mb-1">Você completou o jogo em <strong class="text-warning">${document.getElementById('timer').textContent}</strong>!</p>
      <p class="mb-0">Total de jogadas: <strong class="text-info">${gameState.moves}</strong></p>
    `;
  } else {
    let winnerText = '';
    if (winners.length > 1) {
      winnerText = `<h4 class="text-warning font-weight-bold">Empate entre: ${winners.map(w => w.name).join(', ')}!</h4>`;
    } else {
      winnerText = `<h4 class="text-warning font-weight-bold">Vencedor: ${winners[0].name}! 🎉</h4>`;
    }

    let leaderboardHTML = `<div class="mt-3 text-start bg-secondary bg-opacity-25 p-3 rounded">`;
    sortedPlayers.forEach((p, idx) => {
      leaderboardHTML += `
        <div class="d-flex justify-content-between py-1 border-bottom border-secondary">
          <span>${idx + 1}º ${p.name}</span>
          <span class="fw-bold text-warning">${p.score} pts</span>
        </div>
      `;
    });
    leaderboardHTML += `</div>`;

    victoryDetails.innerHTML = `${winnerText} ${leaderboardHTML}`;
  }

  setTimeout(() => {
    const modal = getVictoryModal();
    if (modal) modal.show();
  }, 500);
}