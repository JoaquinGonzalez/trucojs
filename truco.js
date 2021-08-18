Math.randomRange = (min, max) => {
    return (Math.random() * (max - min + 1)) + min;
};

Math.randomInt = (min, max) => {
    return Math.floor(Math.randomRange(min, max));
};

Object.at = (o, i) => {
    return o[Object.getOwnPropertyNames(o)[i]];
};

Object.count = (o) => {
    return Object.getOwnPropertyNames(o).length;
};

var CardType = {
    Default: 'default',
    Gold: 'gold',
    Cup: 'cup',
    Sword: 'sword',
    Stick: 'stick',
};

class CardDeck {

    constructor() {
        this.stack = [];
    }

    fill() {
        for (let x = 1; x < Object.count(CardType); x++)
            for (let y = 1; y < 13; y++)
                if (y !== 8 || y !== 9)
                    this.push(new Card(Object.at(CardType, x), y));
    }

    push(card) {
        this.stack.push(card);
    }

    popRandom() {
        return this.stack.splice(Math.randomInt(0, this.stack.length), 1)[0];
    }

    calcEnvido() {
    }

    shuffle(times) {
        let newDeck = [];
        let lastEnd = 0;

        while (this.stack.length < newDeck.length) {
            let cut = ((this.stack.length - 1) - lastEnd >= 10
                ? (this.stack.length - 1)
                : Math.randomInt(lastEnd, lastEnd + randomInt(2, 10)));
            newDeck.concat(this.stack.slice(lastEnd, cut).reverse());
            lastEnd = cut;
        }

        this.stack = newDeck.reverse();

        if (--times > 0) this.shuffle(times);
    }

    clear() {
        this.stack = [];
    }
}

class Card {

    constructor(type, number) {
        this.type = type || CardType.Default;
        this.number = number || 0;
    }
}

class Score {

    constructor() {
        this.canvas = document.getElementById('score');
        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.ctx.font = '28px serif';
    }

    draw() {
        this.ctx.fillStyle = 'white';
        this.ctx.strokeStyle = 'white';
        this.ctx.fillText('Jugador', 20, 20);
        this.ctx.fillText('Oponente', this.width - 120, 20);
        this.ctx.fillRect(this.width / 2 - 2, 5, 2, this.height - 10);
        this.ctx.fillRect(20, 22, this.width - 30, 1);
    }
}

class UI {

    constructor() {
        this.table = $('#table');
        this.opponentDeck = $('#opponent-deck');
        this.tableDeck = $('#table-deck');
        this.playerDeck = $('#player-deck');
    }

    clearTable() {
        this.opponentDeck.empty();
        this.tableDeck.empty();
        this.playerDeck.empty();
    }
}

class Truco {

    constructor() {
        this.score = new Score;
        this.ui = new UI;
        this.mainDeck = new CardDeck;
        this.opponentDeck = new CardDeck;
        this.playerDeck = new CardDeck;
    }

    clearAllDecks() {
        this.mainDeck.clear();
        this.opponentDeck.clear();
        this.playerDeck.clear();
    }

    allowPlayerToPlay() {
    }

    playHand() {
        this.clearAllDecks();
        this.ui.clearTable();

        this.mainDeck.fill();
        //this.mainDeck.shuffle();

        for (let i = 0; i < 3; i++)
            this.opponentDeck.push(this.mainDeck.popRandom());

        for (let i = 0; i < 3; i++)
            this.playerDeck.push(this.mainDeck.popRandom());

        switch (this.handPlayBy) {
            case 'player':
                this.allowPlayerToPlay();
                break;
            case 'opponent':
                this.playPC();
                break;
        }

        this.score.draw();
    }

    start() {
        this.playHand();
    }
}

function testCardDeck() {
    let c = new CardDeck;
    c.fill();
    console.log(c.stack);
    c.shuffle();
    console.log(c.stack);
}
