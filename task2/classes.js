class Game {
    constructor() {
        this.deck = new Deck();
        this.player = new Player("player", true);
        this.dealer = new Player("dealer", false);
    }
    checkFor21() {
        // check
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

class Deck {
    constructor() {
        this.cards = [];
    }
    createNewDeck() {
        var suits = ['diamonds', 'hearts', 'spades', 'clubs'];
        var values = [2, 3, 4, 5, 6, 7, 8, 9, 10, "jack", "queen", "king", "ace"]
        values.forEach((value) => {
            suits.forEach((suit) => {
                this.cards.push(new Card(suit, value));
            })
        })
    }
    shuffle() {
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
        // hier wat dingen doen voor de html dingen? om te laten zien?
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