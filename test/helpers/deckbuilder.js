import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'node:url';

import {matchCardByNameAndPack} from './cardutil.js';
import { GameModes } from '../../build/server/GameModes.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PathToSubModulePacks = path.join(__dirname, '../json/Card');

const defaultFaction = 'phoenix';
const defaultRole = 'support-of-the-scorpion';
const defaultStronghold = 'city-of-the-open-hand';
const minProvince = 5;
const provinceFiller = 'shameful-display';
const dynastyFiller = 'adept-of-the-waves';
const conflictFiller = 'supernatural-storm';
const dynastyBuffer = 8; // buffer decks to prevent re-shuffling
const conflictBuffer = 8; // buffer decks to prevent re-shuffling

class DeckBuilder {
    constructor() {
        this.cards = this.loadCards(PathToSubModulePacks);
        this.fillers = {
            faction: defaultFaction,
            role: defaultRole,
            stronghold: defaultStronghold,
            province: provinceFiller,
            dynasty: dynastyFiller,
            conflict: conflictFiller
        };
    }

    loadCards(directory) {
        var cards = {};

        var jsonCards = fs.readdirSync(directory).filter(file => file.endsWith('.json'));
        jsonCards.forEach(file => {
            var cardsInPack = JSON.parse(fs.readFileSync(path.join(PathToSubModulePacks, file), 'utf8'));
            cardsInPack.forEach(card => {
                cards[card.id] = card;
            });
        });
        return cards;
    }

    /*
        options: as player1 and player2 are described in setupTest #1514
    */
    customDeck(player = {}, gameMode = GameModes.Stronghold) {
        let faction = defaultFaction;
        let role = defaultRole;
        let stronghold = defaultStronghold;
        let provinceDeck = [];
        let conflictDeck = [];
        let conflictDeckSize = conflictBuffer;
        let dynastyDeck = [];
        let dynastyDeckSize = dynastyBuffer;
        let inPlayCards = []; // Considered separately, because may consist of both dynasty and conflict

        if(player.faction) {
            faction = player.faction;
        }
        if(player.role) {
            role = player.role;
        }
        if(player.stronghold) {
            stronghold = player.stronghold;
        }
        //Create the province deck
        if(player.strongholdProvince && gameMode !== GameModes.Skirmish) {
            provinceDeck.push(player.strongholdProvince);
        }
        if(player.provinces && gameMode !== GameModes.Skirmish) {
            if(Array.isArray(player.provinces)) {
                provinceDeck = provinceDeck.concat(player.provinces);
            } else {
                Object.values(player.provinces).forEach(province => {
                    if(province.provinceCard) {
                        provinceDeck.push(province.provinceCard);
                    }
                });
            }
        }
        //Fill the deck up to minimum number of provinces
        if(gameMode !== GameModes.Skirmish) {
            while(provinceDeck.length < minProvince) {
                provinceDeck.push(provinceFiller);
            }
        }
        /*
         * Create the dynasty deck - dynasty deck consists of cards in decks,
         * provinces and discard
         */
        let initialDynastySize = 0;
        if(player.dynastyDeckSize) {
            dynastyDeckSize = player.dynastyDeckSize;
        }
        if(player.dynastyDeck) {
            dynastyDeck.push(...player.dynastyDeck);
            initialDynastySize = player.dynastyDeck.length;
        }
        if(player.dynastyDiscard) {
            dynastyDeck.push(...player.dynastyDiscard);
        }
        if(player.provinces) {
            Object.values(player.provinces).forEach(province => {
                if(province && province.dynastyCards) {
                    dynastyDeck.push(...province.dynastyCards);
                }
            });
        }
        //Add cards to prevent reshuffling due to running out of cards
        for(let i = initialDynastySize; i < dynastyDeckSize; i++) {
            dynastyDeck.push(dynastyFiller);
        }
        /**
         * Create the conflict deck - conflict deck consists of cards in decks,
         * hand and discard
         */
        let initialConflictSize = 0;
        if(player.conflictDeckSize) {
            conflictDeckSize = player.conflictDeckSize;
        }
        if(player.conflictDeck) {
            conflictDeck.push(...player.conflictDeck);
            initialConflictSize = player.conflictDeck.length;
        }
        if(player.conflictDiscard) {
            conflictDeck.push(...player.conflictDiscard);
        }
        if(player.hand) {
            conflictDeck.push(...player.hand);
        }
        //Add cards to prevent reshuffling due to running out of cards
        for(let i = initialConflictSize; i < conflictDeckSize; i++) {
            conflictDeck.push(conflictFiller);
        }

        //Collect the names of cards in play
        (player.inPlay || []).forEach(card => {
            if(typeof card === 'string') {
                inPlayCards.push(card);
            } else {
                //Add the card itself
                inPlayCards.push(card.card);
                //Add any attachments
                if(card.attachments) {
                    inPlayCards.push(...card.attachments);
                }
            }
        });

        //Collect all the cards together
        var deck = provinceDeck.concat(conflictDeck)
            .concat(dynastyDeck).concat(inPlayCards)
            .concat(gameMode === GameModes.Skirmish ? [] : role).concat(gameMode === GameModes.Skirmish ? [] : stronghold);

        return this.buildDeck(faction, deck);
    }

    buildDeck(faction, cardLabels) {
        var cardCounts = {};
        cardLabels.forEach(label => {
            var cardData = this.getCard(label);
            if(cardCounts[cardData.id]) {
                cardCounts[cardData.id].count++;
            } else {
                cardCounts[cardData.id] = {
                    count: 1,
                    card: cardData
                };
            }
        });

        return {
            faction: { value: faction },
            stronghold: Object.values(cardCounts).filter(count => count.card.type === 'stronghold'),
            role: Object.values(cardCounts).filter(count => count.card.type === 'role'),
            conflictCards: Object.values(cardCounts).filter(count => count.card.side === 'conflict'),
            dynastyCards: Object.values(cardCounts).filter(count => count.card.side === 'dynasty'),
            provinceCards: Object.values(cardCounts).filter(count => count.card.type === 'province'),
            outsideTheGameCards: this.getShadowlandsSummonables()
        };
    }

    getCard(idOrLabelOrName) {
        if(this.cards[idOrLabelOrName]) {
            return this.cards[idOrLabelOrName];
        }

        var cardsByName = Object.values(this.cards).filter(matchCardByNameAndPack(idOrLabelOrName));

        if(cardsByName.length === 0) {
            throw new Error(`Unable to find any card matching ${idOrLabelOrName}`);
        }

        if(cardsByName.length > 1) {
            var matchingLabels = cardsByName.map(card => `${card.name} (${card.pack_code})`).join('\n');
            throw new Error(`Multiple cards match the name ${idOrLabelOrName}. Use one of these instead:\n${matchingLabels}`);
        }

        return cardsByName[0];
    }

    getShadowlandsSummonables() {
        const val = [];

        val.push(this.cards['bloodthirsty-kansen']);
        val.push(this.cards['bog-hag']);
        val.push(this.cards['dark-moto']);
        val.push(this.cards['endless-ranks']);
        val.push(this.cards['fouleye-s-elite']);
        val.push(this.cards['goblin-brawler']);
        val.push(this.cards['insatiable-gaki']);
        val.push(this.cards['lost-samurai']);
        val.push(this.cards['onikage-rider']);
        val.push(this.cards['oni-of-obsidian-and-blood']);
        val.push(this.cards['penanggalan']);
        val.push(this.cards['scavenging-goblin']);
        val.push(this.cards['shambling-servant']);
        val.push(this.cards['skeletal-warrior']);
        val.push(this.cards['undead-horror']);
        val.push(this.cards['wild-ogre']);

        return val;
    };
}

export default DeckBuilder;
