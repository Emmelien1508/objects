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

class Deck {
    constructor() {
        this.cards = [];
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
        shuffleCards(this.cards);
    }
    deal(shown=true) {
        let dealtCard = this.cards.pop();
        shown ? "" : dealtCard.shown = false;
        return dealtCard;
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

document.addEventListener("DOMContentLoaded", () => {
    let noWinnerYet = true;
    initScores();

    var dealer = new Player("dealer", turn=false);
    var player = new Player("player", turn=true);
    var deck = new Deck();

    while (noWinnerYet) {
        // check whose turn it is
        // wait for choice 
        // stop game or deal card
        // add value to score 
        // determine if winner 
        // give turn to other
        noWinnerYet = false;
    }
})