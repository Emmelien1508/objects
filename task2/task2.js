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
    if (player.turn) {
        hitOrStand();
    } else {
        if (dealer.score < 17) {
            dealer.getCard(deck.deal());
            addCardToTable("dealer");
        } else {
            checkWinner();
        }
    }
}

function hitOrStand() {
    document.querySelector("#hit").addEventListener("click", () => {
        // do something here
        player.getCard(deck.deal());
        addCardToTable("player");
        updateTableScore("player");
        disableButtons();
    })
    
    document.querySelector("#stand").addEventListener("click", () => {
        // game ends
        disableButtons();
        checkWinner();
    })
    player.turn = false;
}

function checkWinner() {
    let result;
    if (player.score <= 21 && dealer.score <= 21) {
        const notSameScore = player.score > dealer.score ? "Player won!" : "Dealer won!";
        result = player.score == dealer.score ? "It's a tie!" : notSameScore;
    } 
    result = "There is no winner :(";
    document.querySelector(".result").innerText = result;
}

function addCardToTable(whoseTurn) {
    let turn = player.name === whoseTurn ? player : dealer
    let table = document.querySelector(`.${whoseTurn}-cards`);
    let card = turn.cards[turn.cards.length - 1];
    table.innerHTML += `<div class="card flex col align-center justify-center">${card.value} ${suits[card.suit]}</div>`;
}

function updateTableScore(whoseTurn) {
    let turn = player.name === whoseTurn ? player : dealer
    let card = turn.cards[turn.cards.length - 1];
    turn.updateScore(card);
    let score = document.querySelector(".player-score");
    score.innerText = turn.score;
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