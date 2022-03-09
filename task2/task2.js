var suits = {
    "diamond": "&diams;",
    "heart": "&hearts;",
    "spade": "&spades;",
    "club": "&clubs;"
}
var values = [2, 3, 4, 5, 6, 7, 8, 9, 10, "jack", "queen", "king", "ace"]

class Game {
    constructor(bettingFor) {
        this.deck = new Deck();
        this.player = new Player("player", true);
        this.dealer = new Player("dealer", false);
        this.bettingFor = bettingFor;
        this.deck.createNewDeck();
        this.deck.shuffle();
        this.firstDeal();
        this.showCardsOnTable(false);
        this.showInitialScores();
    }
    showCardsOnTable(reset=true) {
        this.setBet();
        let tables = document.querySelectorAll(".table");
        tables.forEach((table) => {
            if (reset) {
                table.innerHTML = "";
            }
            const isPlayer = (table.dataset.player ==='true');
            let person = isPlayer ? this.player : this.dealer;
            person.cards.forEach((card) => {
                let htmlText = '<div class="card flex col align-center justify-center';
                htmlText += card.show ? '">' : ' secret">'
                htmlText += `${card.value} ${suits[card.suit]}</div>`
                table.innerHTML += htmlText;
            })
        })
    }
    showInitialScores() {
        let scores = document.querySelectorAll(".score");
        scores.forEach((score) => {
            const isPlayer = (score.dataset.player === 'true');
            score.innerText = isPlayer ? this.player.calculateScore() : "?";
            this.dealer.calculateScore();
        })
    }
    firstDeal() {
        this.player.getCard(this.deck.deal());
        this.dealer.getCard(this.deck.deal(false));
        this.player.getCard(this.deck.deal());
        this.dealer.getCard(this.deck.deal());
    }
    checkFor21() {
        // check if player or dealer has blackjack
        return this.player.calculateScore() == 21 || this.dealer.calculateScore() == 21 ? this.isThereAWinner() : false;
    }
    isThereAWinner() {
        return this.player.calculateScore() == this.dealer.calculateScore() ? false : true;
    }
    whoWins() {
        // get the winner of the game
        if (this.player.calculateScore() == this.dealer.calculateScore()) {
            return "It's a tie!";
        } else if (this.dealer.calculateScore() > 21) {
            return "You win!";
        } else if (this.dealer.calculateScore() > this.player.calculateScore()) {
            return "Dealer wins :(";
        } else {
            return "You win! :)";
        }
    }
    hit() {
        this.dealCardToPlayer();
        if (this.player.calculateScore() > 21) {
            this.disableButtons();
            this.dealer.revealHiddenCard();
            document.querySelector(".dealer-score").innerText = this.dealer.calculateScore();
            document.querySelector(".result").innerHTML = "You lose :(";
            this.player.wallet -= this.bettingFor;
            this.setBet();
        } else {
            this.dealCardToDealer();
        }
    }
    stand() {
        this.disableButtons();
        this.dealer.revealHiddenCard();
        document.querySelector(".dealer-score").innerText = this.dealer.calculateScore();
        let winner = this.whoWins();
        document.querySelector(".result").innerHTML = winner;
        if (winner == "You win! :)") {
            this.player.wallet += this.bettingFor;
        } else if (winner == "Dealer wins :(") {
            this.player.wallet -= this.bettingFor;
        } 
        this.setBet();
    }
    reset() {
        document.querySelector(".result").innerHTML = "";
        this.setBet();
        this.enableButtons();
        this.player.cards = [];
        this.dealer.cards = [];

        this.deck.cards = [];
        this.deck.createNewDeck();
        this.deck.shuffle();

        this.firstDeal();
        this.showCardsOnTable();
        this.showInitialScores();

        if (this.checkFor21()) {
            let winner = this.whoWins();
            document.querySelector(".result").innerHTML = winner;
        };
    }
    dealCardToPlayer() {
        let cardDealt = this.deck.deal();
        this.player.getCard(cardDealt);
        this.player.updateScore(cardDealt);
        document.querySelector(".player-cards").innerHTML += `<div class="card flex col align-center justify-center">${cardDealt.value} ${suits[cardDealt.suit]}</div>`
        document.querySelector(".player-score").innerText = this.player.calculateScore();
    }
    dealCardToDealer() {
        let secondCardDealt = this.deck.deal();
        this.dealer.getCard(secondCardDealt);
        this.dealer.updateScore(secondCardDealt);
        document.querySelector(".dealer-cards").innerHTML += `<div class="card flex col align-center justify-center">${secondCardDealt.value} ${suits[secondCardDealt.suit]}</div>`
    }
    disableButtons() {
        document.querySelector("#hit").classList.add("disabled");
        document.querySelector("#stand").classList.add("disabled");
        document.querySelector("#hit").setAttribute("disabled", true);
        document.querySelector("#stand").setAttribute("disabled", true);
    }
    enableButtons() {
        document.querySelector("#hit").classList.remove("disabled");
        document.querySelector("#stand").classList.remove("disabled");
        document.querySelector("#hit").removeAttribute("disabled");
        document.querySelector("#stand").removeAttribute("disabled");
    }
    setBet() {
        document.querySelector(".bet").innerText = this.bettingFor;
        document.querySelector(".total").innerText = this.player.wallet;
    }
}

class Card {
    constructor(suit, value) {
        this.suit = suit;
        this.value = value;
        this.show = true;
    }
    getNumericValue(aceValue) {
        const faceOrAce = this.value === "ace" ? aceValue : 10;
        return Number.isInteger(this.value) ? this.value : faceOrAce;
    }
}

class Deck {
    constructor() {
        this.cards = [];
    }
    createNewDeck() {
        values.forEach((value) => {
            for (let suit in suits) {
                this.cards.push(new Card(suit, value));
            }
        })
    }
    shuffle() {
        for (var i = this.cards.length - 1; i > 0; i--) {
            // Generate random number
            var j = Math.floor(Math.random() * (i + 1));
            var temp = this.cards[i];
            this.cards[i] = this.cards[j];
            this.cards[j] = temp;
        }
    }
    deal(show=true) {
        let dealtCard = this.cards.pop();
        if (!show) {
            dealtCard.show = false;
        }
        // hier wat dingen doen voor de html dingen? om te laten zien?
        return dealtCard;
    }
}

class Player {
    constructor(name, turn) {
        this.name = name;
        this.cards = [];
        this.isTurn = turn;
        this.wallet = 100;
    }
    getCard(card) {
        this.cards.push(card);
    }
    updateScore(cardDealt, aceValue=1) {
        this.score += cardDealt.getNumericValue(aceValue);
    }
    revealHiddenCard() {
        let hiddenCard = document.querySelector(".secret");
        hiddenCard.classList.remove("secret");
    }
    calculateScore(aceValue=1) {
        let score = 0;
        this.cards.forEach((card) => {
            score += card.getNumericValue(aceValue);
        })
        return score;
    } 
}

document.addEventListener("DOMContentLoaded", () => {
    var game = new Game(10);

    document.querySelector("#hit").addEventListener("click", () => game.hit());
    document.querySelector("#stand").addEventListener("click", () => game.stand());
    document.querySelector("#reset").addEventListener("click", () => game.reset());
})