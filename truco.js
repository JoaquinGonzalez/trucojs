'use strict';
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
    counter: 0,
    current_state: undefined,
    state: {
        PLAYER_HAND: 0,
        OPPONENT_HAND: 1
    },
    ui: {
        elements: {
            table_deck: undefined,
            player_deck: undefined,
            opponent_deck: undefined,
            score: undefined,
            buttons: {
                truco: undefined,
                qrtruco: undefined,
                qv4: undefined,
                quiero: undefined,
                noquiero: undefined,
                envido: undefined,
                renvido: undefined,
                fenvido: undefined
            }
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

                return ele;
            }
        },
        render: function() {
            this.clear();
            this.update();
        },
        update: function() {
            for (let i = 0; i < game.deck.player.length; i++) {
                let c = this.card.createele(game.deck.player[i]);
                c.setAttribute("index", i);
                c.setAttribute('class', c.getAttribute('class') + ' c' + (i + 1));
                c.addEventListener("click", game.card.events.click);
                this.elements.player_deck.append(c);
            }

            for (let i = 0; i < game.deck.opponent.length; i++) {
                let c = this.card.createele(game.card.new());
                c.setAttribute("index", i);
                c.setAttribute('class', c.getAttribute('class') + ' co' + (i + 1));
                this.elements.opponent_deck.append(c);
            }

            for (let i = 0; i < game.deck.table.length; i++) {
                let c = game.deck.table[i];
                let cele = this.card.createele(c);
                let cls = "t";
                if (c.owner == 1) cls += "o";
                cls += i+1;
                cele.setAttribute("class", cele.getAttribute("class") + " " + cls);
                this.elements.table_deck.append(cele);
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
            this.elements.buttons.truco = document.getElementById("btn-truco");
            this.elements.buttons.qrtruco = document.getElementById("btn-qrtruco");
            this.elements.buttons.qv4 = document.getElementById("btn-qv4");
            this.elements.buttons.quiero = document.getElementById("btn-quiero");
            this.elements.buttons.noquiero = document.getElementById("btn-noquiero");
            this.elements.buttons.envido = document.getElementById("btn-envido");
            this.elements.buttons.renvido = document.getElementById("btn-renvido");
            this.elements.buttons.fenvido = document.getElementById("btn-fenvido");

            Object.keys(this.elements.buttons).forEach((k) => {
                let ele = this.elements.buttons[k];
                ele.addEventListener("click", game.player.events[k]);
            });
        }
    },
    card: {
        s_card: {
            type: undefined,
            number: undefined,
            envidoval: function() {
                switch (this.number) {
                    case 1: return 1;
                    case 7: return 7;
                    case 3: return 3;
                    case 2: return 2;
                    case 12: return 0;
                    case 11: return 0;
                    case 10: return 0;
                    case 6: return 6;
                    case 5: return 5;
                    case 4: return 4;
                }
            }
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
                if (game.current_state == game.state.PLAYER_HAND) {
                    let i = e.target.getAttribute("index");
                    game.player.playcard(i);
                }
            }
        },
        cmp: function(c1, c2) {
            let order = [
                {n: 1, t: [game.card.type.SWORD, game.card.type.STICK]},
                {n: 7, t: [game.card.type.SWORD, game.card.type.GOLD]},
                {n: 3, t: null},
                {n: 2, t: null},
                {n: 1, t: [game.card.type.CUP, game.card.type.GOLD]},
                {n: 12, t: null},
                {n: 11, t: null},
                {n: 10, t: null},
                {n: 7, t: [game.card.type.CUP, game.card.type.STICK]},
                {n: 6, t: null},
                {n: 5, t: null},
                {n: 4, t: null}
            ];

            let cmporder = function(card, entry) {
                if (entry.n === card.number) {
                    if (entry.t !== null) {
                        for (let i = 0; i < entry.t.length; i++) {
                            if (entry.t[i] === card.type) {
                                return true;
                            }
                        }
                    } else {
                        return true;
                    }
                }
                return false;
            };

            // finds the card position in the order table and returns its position index
            let findorder = function(card) {
                for (let i = 0; i < order.length; i++) {
                    let j = order.length - i - 1;

                    if (cmporder(card, order[i])) return i;
                    else if (cmporder(card, order[j])) return j;
                }
            }

            let c1o = findorder(c1);
            let c2o = findorder(c2);

            // if the result is positive means that c1 is better than c2
            // if the result is negative means that c1 is worst than c2
            // if the result is 0 means that the cards are the same
            return c2o - c1o;
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
        table: [],
        clear: function(deck) {
            if (deck.pop() !== undefined) this.clear(deck);
        },
        calcenvido: function(deck) {
            let e = 0;
            let l = [];

            let top = function() {
                return l[l.length - 1];
            };

            for (let i = 0; i < deck.length; i++) {
                let c = deck[i];

                if (i == 1) {
                    if (deck[i-1].type == c.type) {
                        l.push(deck[i-1]);
                        l.push(c);
                    }
                }

                if (i == 2) {
                    if (l.length > 0) {
                        if (deck[i-1].type == c.type) {
                            if (deck[0].envidoval() < c.envidoval()) {
                                l.splice(0, 1);
                                l.push(c);
                            } else if (deck[1].envidoval() < c.envidoval()) {
                                l.splice(1, 1);
                                l.push(c);
                            }
                        }
                    } else {
                        if (deck[0].type == c.type) {
                            l.push(deck[0]);
                            l.push(c);
                        } else if (deck[1].type == c.type) {
                            l.push(deck[1]);
                            l.push(c);
                        }
                    }
                }
            }

            if (l.length > 0) {
                e = 20;

                l.forEach((c) => {
                    e += c.envidoval();
                });
            }

            return e;
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
            for (let x = 2; x < Object.count(game.card.type); x++)
                for (let y = 1; y < 13; y++)
                    if (y !== 8 && y !== 9)
                        deck.push(game.card.new(Object.at(game.card.type, x), y));
        },
        shuffle: function(deck) {
            for (let i = 0; i < deck.length; i++) {
                if (i < deck.length - 3) {
                    let ri = Math.randomRange(i + 1, deck.length - 1);
                    let c = deck[ri];
                    let lc = deck[i];
                    deck[i] = c;
                    deck[ri] = lc;
                }
            }
        }
    },
    history: {
        type: {
            PUSH_CARD: 0,
            TRUCO: 1,
            QUIERO_RE_TRUCO: 2,
            QUIRE_VALE_4: 3,
            ENVIDO: 4,
            REAL_ENVIDO: 5,
            FALTA_ENVIDO: 6,
            IR_AL_MAZO: 7
        },
        actions: [],
        add: function(type, value) {
            this.actions.push({type: type, value: value});
        }
    },
    computer: {
        score: 0,
        play: function() {
            let tc = game.deck.table[game.deck.table.length-1];
            let lc = [];
            let la = null;

            // find all the cards that beat player
            for (let i = 0; i < game.deck.opponent.length; i++) {
                let c = game.deck.opponent[i];

                if (game.card.cmp(c, tc) >= 0) {
                    lc.push(i);
                }

                // we save the worst card if none of them are better than player
                if (la === null) la = i;
                else {
                    if (game.card.cmp(c, game.deck.opponent[la]) < 0) {
                        la = i;
                    }
                }
            }

            if (lc.length > 0) {
                let low = lc[0];

                // we look up for the worst card among the preselected that beat player card
                for (let i = 1; i < lc.length; i++) {
                    let c = game.deck.opponent[lc[i]];
                    let lowc = game.deck.opponent[low];

                    if (game.card.cmp(lowc, c) > 0) {
                        low = i;
                        lc.splice(i, 1);
                    }
                }

                let c = game.deck.opponent[low];
                c.owner = 1;
                game.deck.opponent.splice(low, 1);
                game.deck.table.push(c);
                game.history.add(game.history.type.PUSH_CARD, c);

                // if is the first hand we compare the last two remaining cards
                // to check who is the worst card
                if (game.counter === 0) {
                    let ac = game.deck.opponent[0];
                    let bc = game.deck.opponent[1];

                    if (game.card.cmp(bc, ac) > 0) {
                        game.deck.opponent.splice(0, 1);
                        ac.owner = 1;
                        game.deck.table.push(ac);
                    } else {
                        game.deck.opponent.splice(1, 1);
                        bc.owner = 1;
                        game.deck.table.push(bc);
                    }
                }
            } else { // if we dont have cards that beat player we push the saved one
                let c = game.deck.opponent[la];
                game.deck.opponent.splice(la, 1);
                c.owner = 1;
                game.deck.table.push(c);
            }

            game.ui.render();
            game.continue();
        }
    },
    player: {
        score: 0,
        events: {
            truco: function(e) {
            },
            qrtruco: function(e) {
            },
            qv4: function(e) {
            },
            quiero: function(e) {
            },
            noquiero: function(e) {
            },
            envido: function(e) {
                alert(game.deck.calcenvido(game.deck.player));
            },
            renvido: function(e) {
            },
            fenvido: function(e) {
            }
        },
        playcard: function(i) {
            let c = game.deck.player[i];
            c.owner = 0;
            game.deck.player.splice(i, 1);
            game.deck.table.push(c);
            game.history.add(game.history.type.PUSH_CARD, c);
            game.ui.render();
            game.continue();
        }
    },
    continue: function() {
        if (this.current_state === this.state.PLAYER_HAND) {
            this.current_state = this.state.OPPONENT_HAND;
            this.computer.play();
        }
        else if(this.current_state === this.state.OPPONENT_HAND)
            this.current_state = this.state.PLAYER_HAND;

        ++this.counter;
    },
    playhand: function() {
        this.current_state = this.state.PLAYER_HAND;
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
