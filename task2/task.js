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

// suits["diamond"] = "&diams;";
// suits["heart"] = "&hearts;";
// suits["spade"] = "&spades;";
// suits["club"] = "&clubs;";

class Deck {
    constructor() {
        this.cards = [];
        var suits = ['diamonds', 'hearts', 'spades', 'clubs'];
        var values = [2, 3, 4, 5, 6, 7, 8, 9, 10, "jack", "queen", "king", "ace"]
        values.forEach((value) => {
            suits.forEach((suit) => {
                this.cards.push(new Card(suit, value));
            })
        })
    }
    shuffleDeck() {
        for (var i = this.cards.length - 1; i > 0; i--) {
            // Generate random number
            var j = Math.floor(Math.random() * (i + 1));
            var temp = this.array[i];
            this.array[i] = this.array[j];
            this.array[j] = temp;
        }
    }

    deal(shown=true) {
        let dealtCard = this.cards.pop();
        shown ? "" : dealtCard.shown = false;
        return dealtCard;
    }
}

class Player {
    constructor(name, turn) {
        this.name = name;
        this.cards = [];
        this.score = 0;
        this.isTurn = turn;
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

function isThereAWinner(player) {
    if (player.score > 21) return true
    return false

}


document.addEventListener("DOMContentLoaded", () => {
    let noWinnerYet = true;

    var dealer = new Player("dealer", isTurn=false);
    var player = new Player("player", isTurn=true);
    var deck = new Deck();

    while (noWinnerYet) {
        // check whose turn it is
        let activePlayer = player.isTurn ? player : dealer;
        let otherPlayer = player.isTurn ? dealer : player;

        document.querySelector('.turn').innerText = `It's ${activePlayer.name} turn`

        // wait for choice 
        document.querySelector('#hit').addEventListener('click', () => {
            console.log("Player hits")
            let dealtCard = deck.deal(true)
            activePlayer.getCard(dealtCard)
            activePlayer.updateScore(dealtCard)
        })

        document.querySelector('#stand').addEventListener('click', () => {
            console.log("Player stands")
        })

        noWinnerYet = isThereAWinner(activePlayer) ? false : true;

        if (noWinnerYet) {
            activePlayer.isTurn = false
            otherPlayer.isTurn = true
        }


        // determine if winner 
        // give turn to other
        noWinnerYet = false;
    }

})