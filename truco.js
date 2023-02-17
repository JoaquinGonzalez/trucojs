Math.randomRange = (min, max) => {
    return Math.floor((Math.random() * (max - min + 1)) + min);
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
    DEFAULT: 0,
    GOLD: 1,
    CUP: 2,
    SWORD: 3,
    STICK: 4,
};

var UIElements = {
    TABLE_DECK: null,
    PLAYER_DECK: null,
    OPPONENT_DECK: null,
    SCORE: null
};

class Card {

    constructor(type, number) {
        this.type = type || CardType.DEFAULT;
        this.number = number || 0;
    }
}

var ctx = undefined;
var maindeck = [];
var opponentdeck = [];
var playerdeck = [];

function cleardeck(deck) {
    if (deck.pop() !== undefined) cleardeck(deck);
}

function filldeck(deck) {
    for (let x = 1; x < Object.count(CardType); x++)
        for (let y = 1; y < 13; y++)
            if (y !== 8 && y !== 9)
                deck.push(new Card(Object.at(CardType, x), y));
}

function shuffledeck(deck) {
    for (let i = 0; i < deck.length; i++) {
        if (i < deck.length - 2) {
            let ri = Math.randomRange(i + 1, deck.length - 1);
            let c = deck[ri];
            let lc = deck[i];
            deck[i] = c;
            deck[ri] = lc;
        }
    }
}

function initscore() {
    ctx = UIElements.SCORE.getContext('2d');
}

function emptyalluideck() {
    for (let i = 0; i < Object.count(UIElements); i++) {
        let ele = Object.at(UIElements, i);
        while (ele.firstChild) {
            ele.removeChild(ele.lastChild);
        }
    }
}

function createcardele(card) {
    let ele = document.createElement('div');

    switch (card.type) {
        case CardType.DEFAULT:
            ele.setAttribute('class', 'card card-default');
            break;
    }

    return ele;
}

function addcardui(ele, card) {
    ele.append(card);
}

function updateui() {
    for (let i = 0; i < playerdeck.length; i++) {
        let c = createcardele(new Card());
        c.setAttribute('class', c.getAttribute('class') + ' c' + (i + 1));
        addcardui(UIElements.PLAYER_DECK, c);
    }

    for (let i = 0; i < opponentdeck.length; i++) {
        let c = createcardele(new Card());
        c.setAttribute('class', c.getAttribute('class') + ' c' + (i + 1));
        addcardui(UIElements.OPPONENT_DECK, c);
    }
}

function initui() {
    UIElements.TABLE_DECK = document.getElementById("table-deck");
    UIElements.PLAYER_DECK = document.getElementById("player-deck");
    UIElements.OPPONENT_DECK = document.getElementById("opponent-deck");
    UIElements.SCORE = document.getElementById("score");
}

function splitdeck() {
    for (let i = 0; i < 3; i++) {
        playerdeck.push(maindeck.pop());
        opponentdeck.push(maindeck.pop());
    }
}

function clearalldecks() {
    cleardeck(maindeck);
    cleardeck(opponentdeck);
    cleardeck(playerdeck);
}

function playhand() {
    splitdeck();
    updateui();
}

function startgame() {
    initui();
    initscore();
    emptyalluideck();
    clearalldecks();
    filldeck(maindeck);
    shuffledeck(maindeck);
    playhand();
}
