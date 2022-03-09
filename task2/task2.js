class Deck {
    constructor() {
        this.cards = [];
    }
    shuffle() {
        shuffleCards(this.cards);
    }   
    deal(shown=true) {
        let dealtCard = this.cards.pop();
        shown ? "" : dealtCard.shown = false;
        return dealtCard;
    }
}

class Card {
    constructor(suit, value) {
        this.suit = suit;
        this.value = value;
        this.shown = true;
    }
    getNumericValue(aceValue) {
        const faceOrAce = this.value === "ace" ? aceValue : 10;
        return Number.isInteger(this.value) ? this.value : faceOrAce;
    }
}

class Player {
    constructor(name, turn) {
        this.name = name;
        this.cards = [];
        this.score = 0;
        this.turn = turn;
    }
    getCard(card) {
        this.cards.push(card);
    }
    hit() {
        if (this.name === "dealer") {
            return this.score < 17 ? true : false;
        }
        return true;
    }
    updateScore(card, aceValue=11) {
        this.score += card.getNumericValue(aceValue);
    }
    calculateScore(aceValue=11) {
        this.cards.forEach((card) => {
            this.score += card.getNumericValue(aceValue);
        })
        return this.score;
    } 
}

function shuffleCards(array) {
    for (var i = array.length - 1; i > 0; i--) {
        // Generate random number
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

var dealer = new Player("dealer", false);
var player = new Player("player", true);
var deck = new Deck();
var suits = [];
suits["diamond"] = "&diams;";
suits["heart"] = "&hearts;";
suits["spade"] = "&spades;";
suits["club"] = "&clubs;";
var values = [2, 3, 4, 5, 6, 7, 8, 9, 10, "jack", "queen", "king", "ace"]

values.forEach((value) => {
    for (suit in suits) {
        deck.cards.push(new Card(suit, value));
    }
})

dealFirstCards();

function dealFirstCards() {
    deck.shuffle();
    player.getCard(deck.deal());
    dealer.getCard(deck.deal());
    player.getCard(deck.deal());
    dealer.getCard(deck.deal(shown=false));
}

document.addEventListener("DOMContentLoaded", () => {
    initCardsOnTable();
    initScores();
    startGame();
})

function initCardsOnTable() {
    let tables = document.querySelectorAll(".table");
    tables.forEach((table) => {
        const isPlayer = (table.dataset.player ==='true');
        let person = isPlayer ? player : dealer;
        person.cards.forEach((card) => {
            let htmlText = '<div class="card flex col align-center justify-center';
            htmlText += card.shown ? '">' : ' secret">'
            htmlText += `${card.value} ${suits[card.suit]}</div>`
            table.innerHTML += htmlText;
        })
    })
}

function initScores() {
    let scores = document.querySelectorAll(".score");
    scores.forEach((score) => {
        const isPlayer = (score.dataset.player === 'true');
        score.innerText = isPlayer ? player.calculateScore() : "?";
    })
}

function startGame() {
    let turn = player.turn ? player : dealer;
    document.querySelector(".turn").innerText = `It's ${turn.name}'s turn`;

    while (gameNotWon()) {
        playGame();
    }
}

function gameNotWon() {
    return player.score > 21 ? false : true;
}

function playGame() {
    if (player.turn) {
        var buttons = document.querySelector(".decision-buttons").children;
        Array.from(buttons).forEach(function (button) {
            button.addEventListener("click", () => {
                let hit = button.innerText == "Hit" ? true : false;
                if (hit) {
                    console.log("do something here");
                    player.getCard(deck.deal());
                    addCardToTable();
                    updateTableScore();
                    if (gameNotWon()) {
                        player.turn = false;
                    } 
                    disableButtons();
                } else {
                    playerClickedOnStand = true;
                }
            })
        });
    } else {
        disableButtons();
    }
}

function addCardToTable() {
    let playerTable = document.querySelector(".player-cards");
    let card = player.cards[player.cards.length - 1];
    playerTable.innerHTML += `<div class="card flex col align-center justify-center">${card.value} ${suits[card.suit]}</div>`;
}

function updateTableScore() {
    let card = player.cards[player.cards.length - 1];
    player.updateScore(card);
    let score = document.querySelector(".player-score");
    score.innerText = player.score;
}

function disableButtons() {
    var buttons = document.querySelector(".decision-buttons").children;
    for (button of buttons) {
        button.classList.add("disabled");
    }
}
// based on current cards on the table, the player either clicks on "hit" or "stand" button
    // if "hit" button is clicked, add another card to players deck
    // else if "stand" button is clicked, dealer reveals hidden card and winner is decided
// decisionButtons = document.querySelectorAll(".decision-buttons");
// decisionButtons.forEach((button) => {
//     button.addEventListener("click", () => {
//         if (button.dataset.decision == "hit") {
//             dealtCard = deck.deal();
//             player.getCard(dealtCard);
//             if (dealtCard.value === "ace") {
//                 // prompt user to get ace value either 1 or 11
//                 var aceValue = prompt("Do you want this ace to have value 1 or 11?")
//             }
//             player.updateScore(dealtCard, aceValue);

//             // dealer get another card
//             dealer.getCard(deck.deal());
//         } else {
//             // dealer shows cards
//             dealer.cards.forEach((card) => {
//                 card.shown = true;
//             })
//         }
//     })
// })

// function decideWinner() {
//     if (player.score === dealer.score) {
//         return "It's a tie";
//     } else if (player.score > dealer.score) {
//         return "Player wins";
//     } else {
//         return "Dealer wins";
//     }
// }