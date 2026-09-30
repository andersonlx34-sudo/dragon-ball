/* ========================================
   PERSONAGENS
======================================== */

const characters = [

    {
        name: "Goku",
        symbol: "悟",
        c1: "#ff9800",
        c2: "#f44336"
    },

    {
        name: "Vegeta",
        symbol: "王",
        c1: "#1976d2",
        c2: "#0d47a1"
    },

    {
        name: "Gohan",
        symbol: "悟",
        c1: "#7b1fa2",
        c2: "#311b92"
    },

    {
        name: "Piccolo",
        symbol: "P",
        c1: "#43a047",
        c2: "#1b5e20"
    },

    {
        name: "Trunks",
        symbol: "T",
        c1: "#7e57c2",
        c2: "#283593"
    },

    {
        name: "Freeza",
        symbol: "F",
        c1: "#ce93d8",
        c2: "#6a1b9a"
    },

    {
        name: "Cell",
        symbol: "C",
        c1: "#66bb6a",
        c2: "#1b5e20"
    },

    {
        name: "Majin Boo",
        symbol: "B",
        c1: "#ec407a",
        c2: "#880e4f"
    },

    {
        name: "Kuririn",
        symbol: "K",
        c1: "#ffb300",
        c2: "#e65100"
    },

    {
        name: "Goten",
        symbol: "G",
        c1: "#42a5f5",
        c2: "#1565c0"
    },

    {
        name: "Android 18",
        symbol: "18",
        c1: "#90caf9",
        c2: "#3949ab"
    },

    {
        name: "Broly",
        symbol: "B",
        c1: "#8bc34a",
        c2: "#33691e"
    }

];


/* ========================================
   ELEMENTOS HTML
======================================== */

const grid =
    document.getElementById("gameGrid");

const timerEl =
    document.getElementById("timer");

const movesEl =
    document.getElementById("moves");

const playersBoard =
    document.getElementById("playersBoard");

const message =
    document.getElementById("message");

const settingsModal =
    document.getElementById("settingsModal");

const victoryModal =
    document.getElementById("victoryModal");

const playerNames =
    document.getElementById("playerNames");

const openSettings =
    document.getElementById("openSettings");

const closeSettings =
    document.getElementById("closeSettings");

const newGameBtn =
    document.getElementById("newGame");

const playAgainBtn =
    document.getElementById("playAgain");


/* ========================================
   VARIÁVEIS
======================================== */

let difficulty = "easy";

let playerCount = 1;

let players = [];

let currentPlayer = 0;

let firstCard = null;

let secondCard = null;

let lockBoard = false;

let matchedPairs = 0;

let totalPairs = 4;

let moves = 0;

let seconds = 0;

let timerInterval = null;

let gameStarted = false;


/* ========================================
   EMBARALHAR
======================================== */

function shuffle(array) {

    const copy = [...array];

    for (
        let i = copy.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [
            copy[i],
            copy[j]
        ] =
        [
            copy[j],
            copy[i]
        ];

    }

    return copy;
}


/* ========================================
   DIFICULDADE
======================================== */

function getDifficultyData() {

    if (difficulty === "medium") {

        return {

            pairs: 8,

            className: "medium"

        };

    }


    if (difficulty === "hard") {

        return {

            pairs: 12,

            className: "hard"

        };

    }


    return {

        pairs: 4,

        className: "easy"

    };

}


/* ========================================
   NOMES DOS JOGADORES
======================================== */

function updateNameInputs() {

    const selected =
        document.querySelector(
            'input[name="players"]:checked'
        );

    playerCount =
        Number(selected.value);

    playerNames.innerHTML = "";


    for (
        let i = 0;
        i < playerCount;
        i++
    ) {

        const input =
            document.createElement("input");

        input.className =
            "name-input";

        input.placeholder =
            `Nome do Jogador ${i + 1}`;

        input.value =
            `Jogador ${i + 1}`;

        input.dataset.player =
            i;

        playerNames.appendChild(input);

    }

}


/* ========================================
   MOSTRAR JOGADORES
======================================== */

function renderPlayers() {

    playersBoard.innerHTML = "";


    players.forEach(
        (player, index) => {

            const badge =
                document.createElement("div");

            badge.className =
                "player-badge";


            if (
                index === currentPlayer
            ) {

                badge.classList.add(
                    "active"
                );

            }


            badge.innerHTML = `

                <div class="name">
                    ${player.name}
                </div>

                <div class="score">
                    ${player.score}
                    ponto${player.score === 1 ? "" : "s"}
                </div>

            `;


            playersBoard.appendChild(
                badge
            );

        }
    );

}


/* ========================================
   ATUALIZAR JOGADOR
======================================== */

function updateActivePlayer() {

    document
        .querySelectorAll(
            ".player-badge"
        )
        .forEach(
            (badge, index) => {

                badge.classList.toggle(
                    "active",
                    index === currentPlayer
                );

            }
        );

}


/* ========================================
   CRONÔMETRO
======================================== */

function startTimer() {

    clearInterval(
        timerInterval
    );


    timerInterval =
        setInterval(
            () => {

                seconds++;


                const minutes =
                    String(
                        Math.floor(
                            seconds / 60
                        )
                    ).padStart(
                        2,
                        "0"
                    );


                const secs =
                    String(
                        seconds % 60
                    ).padStart(
                        2,
                        "0"
                    );


                timerEl.textContent =
                    `${minutes}:${secs}`;

            },
            1000
        );

}


function resetTimer() {

    clearInterval(
        timerInterval
    );

    seconds = 0;

    timerEl.textContent =
        "00:00";

}


/* ========================================
   CRIAR CARTA
======================================== */

function createCard(
    character,
    index
) {

    const card =
        document.createElement("div");

    card.className =
        "card";

    card.dataset.name =
        character.name;

    card.dataset.index =
        index;


    card.innerHTML = `

        <div class="face back">

            <div class="dragon-ball">
                ★
            </div>

        </div>


        <div class="face front">

            <div
                class="character-symbol"
                style="
                    --c1:${character.c1};
                    --c2:${character.c2};
                "
            >
                ${character.symbol}
            </div>

            <div class="character-name">
                ${character.name}
            </div>

        </div>

    `;


    card.addEventListener(
        "click",
        () => flipCard(card)
    );


    return card;

}


/* ========================================
   CRIAR TABULEIRO
======================================== */

function createBoard() {

    const data =
        getDifficultyData();


    totalPairs =
        data.pairs;

    matchedPairs = 0;

    moves = 0;


    movesEl.textContent =
        "0";


    grid.className =
        `game-grid ${data.className}`;


    grid.innerHTML = "";


    const selectedCharacters =
        characters.slice(
            0,
            totalPairs
        );


    const deck =
        shuffle(
            [
                ...selectedCharacters,
                ...selectedCharacters
            ]
        );


    deck.forEach(
        (character, index) => {

            grid.appendChild(
                createCard(
                    character,
                    index
                )
            );

        }
    );

}


/* ========================================
   VIRAR CARTA
======================================== */

function flipCard(card) {

    if (

        lockBoard ||

        card.classList.contains(
            "flipped"
        ) ||

        card.classList.contains(
            "matched"
        )

    ) {

        return;

    }


    if (!gameStarted) {

        gameStarted = true;

        startTimer();

        message.textContent =
            `Vez de ${players[currentPlayer].name}`;

    }


    card.classList.add(
        "flipped"
    );


    if (!firstCard) {

        firstCard = card;

        return;

    }


    secondCard = card;

    lockBoard = true;

    moves++;

    movesEl.textContent =
        moves;


    const same =
        firstCard.dataset.name ===
        secondCard.dataset.name;


    if (same) {

        handleMatch();

    } else {

        handleWrong();

    }

}


/* ========================================
   ACERTOU
======================================== */

function handleMatch() {

    firstCard.classList.add(
        "matched"
    );

    secondCard.classList.add(
        "matched"
    );


    players[currentPlayer].score++;

    matchedPairs++;


    renderPlayers();

    resetTurn();


    message.textContent =
        `${players[currentPlayer].name} encontrou um par! 🔥`;


    if (
        matchedPairs === totalPairs
    ) {

        finishGame();

    }

}


/* ========================================
   ERROU
======================================== */

function handleWrong() {

    firstCard.classList.add(
        "wrong"
    );

    secondCard.classList.add(
        "wrong"
    );


    message.textContent =
        "Não foi dessa vez!";


    setTimeout(
        () => {

            firstCard.classList.remove(
                "flipped",
                "wrong"
            );

            secondCard.classList.remove(
                "flipped",
                "wrong"
            );


            currentPlayer =
                (
                    currentPlayer + 1
                ) % players.length;


            resetTurn();

            updateActivePlayer();


            message.textContent =
                `Vez de ${players[currentPlayer].name}`;

        },
        750
    );

}


/* ========================================
   RESETAR TURNO
======================================== */

function resetTurn() {

    firstCard = null;

    secondCard = null;

    lockBoard = false;

}


/* ========================================
   FINAL DO JOGO
======================================== */

function finishGame() {

    clearInterval(
        timerInterval
    );


    const maxScore =
        Math.max(
            ...players.map(
                player => player.score
            )
        );


    const winners =
        players.filter(
            player =>
                player.score === maxScore
        );


    let winnerText;


    if (
        winners.length === 1
    ) {

        winnerText = `

            🏆

            <strong>
                ${winners[0].name}
            </strong>

            venceu com
            ${maxScore}
            ponto${maxScore === 1 ? "" : "s"}!

        `;

    } else {

        winnerText = `

            🤝

            Empate entre

            ${winners
                .map(
                    winner =>
                        `<strong>${winner.name}</strong>`
                )
                .join(" e ")
            }

            com
            ${maxScore}
            pontos!

        `;

    }


    document.getElementById(
        "victoryDetails"
    ).innerHTML = `

        <p>
            ${winnerText}
        </p>

        <p>
            ⏱ Tempo:
            <strong>
                ${timerEl.textContent}
            </strong>
        </p>

        <p>
            🔄 Jogadas:
            <strong>
                ${moves}
            </strong>
        </p>

    `;


    victoryModal.classList.remove(
        "hidden"
    );

}


/* ========================================
   NOVO JOGO
======================================== */

function startNewGame() {

    difficulty =
        document.querySelector(
            'input[name="difficulty"]:checked'
        ).value;


    playerCount =
        Number(
            document.querySelector(
                'input[name="players"]:checked'
            ).value
        );


    const inputs =
        [
            ...document.querySelectorAll(
                ".name-input"
            )
        ];


    players =
        inputs.map(
            (input, index) => ({

                name:
                    input.value.trim() ||
                    `Jogador ${index + 1}`,

                score: 0

            })
        );


    currentPlayer = 0;

    firstCard = null;

    secondCard = null;

    lockBoard = false;

    gameStarted = false;


    resetTimer();

    createBoard();

    renderPlayers();


    message.textContent =
        `Comece encontrando os pares, ${players[0].name}!`;


    settingsModal.classList.add(
        "hidden"
    );


    victoryModal.classList.add(
        "hidden"
    );

}


/* ========================================
   EVENTOS
======================================== */

document
    .querySelectorAll(
        'input[name="players"]'
    )
    .forEach(
        input => {

            input.addEventListener(
                "change",
                updateNameInputs
            );

        }
    );


openSettings.addEventListener(
    "click",
    () => {

        settingsModal.classList.remove(
            "hidden"
        );

    }
);


closeSettings.addEventListener(
    "click",
    () => {

        settingsModal.classList.add(
            "hidden"
        );

    }
);


newGameBtn.addEventListener(
    "click",
    startNewGame
);


playAgainBtn.addEventListener(
    "click",
    startNewGame
);


/* FECHAR CLICANDO FORA */

settingsModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            settingsModal
        ) {

            settingsModal.classList.add(
                "hidden"
            );

        }

    }
);


victoryModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            victoryModal
        ) {

            victoryModal.classList.add(
                "hidden"
            );

        }

    }
);


/* ========================================
   INICIALIZAÇÃO
======================================== */

updateNameInputs();

startNewGame();