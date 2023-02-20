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

var game = {
    ui: {
        elements: {
            table_deck: undefined,
            player_deck: undefined,
            opponent_deck: undefined,
            score: undefined
        },
        score: {
            ctx: undefined,
            init: function() {
                this.ctx = game.ui.elements.score.getContext("2d");
            }
        },
        card: {
            createele(card) {
                let ele = document.createElement('div');
                let eleclass = "card card-";

                switch (card.type) {
                    case game.card.type.GOLD:
                        eleclass += "gold";
                        break;
                    case game.card.type.CUP:
                        eleclass += "cup";
                        break;
                    case game.card.type.SWORD:
                        eleclass += "sword";
                        break;
                    case game.card.type.STICK:
                        eleclass += "stick";
                        break;
                    case game.card.type.DEFAULT:
                        eleclass += "default";
                        break;
                }

                eleclass += " card-" + card.number;

                ele.setAttribute("class", eleclass);
                ele.addEventListener("click", game.card.events.click);

                return ele;
            }
        },
        update: function() {
            for (let i = 0; i < game.deck.player.length; i++) {
                let c = this.card.createele(game.deck.player[i]);
                c.setAttribute("index", i);
                c.setAttribute('class', c.getAttribute('class') + ' c' + (i + 1));
                this.elements.player_deck.append(c);
            }

            for (let i = 0; i < game.deck.opponent.length; i++) {
                let c = this.card.createele(game.card.new());
                c.setAttribute("index", i);
                c.setAttribute('class', c.getAttribute('class') + ' c' + (i + 1));
                this.elements.opponent_deck.append(c);
            }
        },
        clear: function() {
            for (let i = 0; i < Object.count(this.elements); i++) {
                let ele = Object.at(this.elements, i);
                while (ele.firstChild) {
                    ele.removeChild(ele.lastChild);
                }
            }
        },
        init: function() {
            this.elements.table_deck = document.getElementById("table-deck");
            this.elements.player_deck = document.getElementById("player-deck");
            this.elements.opponent_deck = document.getElementById("opponent-deck");
            this.elements.score = document.getElementById("score");
        }
    },
    card: {
        s_card: {
            type: undefined,
            number: undefined
        },
        type: {
            DEFAULT: 0,
            GOLD: 1,
            CUP: 2,
            SWORD: 3,
            STICK: 4
        },
        events: {
            click: function(e) {
                console.log(game.deck.player[e.target.getAttribute("index")]);
            }
        },
        new: function(type, number) {
            let c = Object.create(this.s_card);
            c.type = type || this.type.DEFAULT;
            c.number = number || 0;
            return c;
        }
    },
    deck: {
        main: [],
        opponent: [],
        player: [],
        clear: function(deck) {
            if (deck.pop() !== undefined) this.clear(deck);
        },
        split: function() {
            for (let i = 0; i < 3; i++) {
                this.player.push(this.main.pop());
                this.opponent.push(this.main.pop());
            }
        },
        clearall: function() {
            this.clear(this.main);
            this.clear(this.opponent);
            this.clear(this.player);
        },
        fill: function (deck) {
            for (let x = 1; x < Object.count(game.card.type); x++)
                for (let y = 1; y < 13; y++)
                    if (y !== 8 && y !== 9)
                        deck.push(game.card.new(Object.at(game.card.type, x), y));
        },
        shuffle: function(deck) {
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
    },
    playhand: function() {
        this.deck.split();
        this.ui.update();
    },
    start: function() {
        this.ui.init();
        this.ui.score.init();
        this.ui.clear();
        this.deck.clearall();
        this.deck.fill(this.deck.main);
        this.deck.shuffle(this.deck.main);
        this.playhand();
    }
};
