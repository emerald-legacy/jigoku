import { Phases, CardType, Players, EffectName, EventName, Location, TargetMode } from '../Constants.js';
import type DrawCard from '../DrawCard.js';
import type Game from '../Game.js';
import type Player from '../Player.js';
import { Phase } from './Phase.js';
import { SimpleStep } from './SimpleStep.js';
import ActionWindow from './ActionWindow.js';

function characterShouldBeDiscarded(character: DrawCard) {
    return character.fate === 0 && character.allowGameAction('discardFromPlay');
}

/**
 * IV. Fate Phase
 * 4.1 Fate phase begins.
 * 4.2 Discard characters with no fate.
 * 4.3 Remove fate from characters.
 * 4.4 Place fate on unclaimed rings.
 * ◊ ACTION WINDOW
 * Proceed to Dynasty Phase.
 * 4.6 Discard from provinces.
 * 4.5 Ready cards.
 * 4.7 Return rings.
 * 4.8 Pass first player token.
 * 4.9 Fate phase ends
 */
export class FatePhase extends Phase {
    constructor(game: Game) {
        super(game, Phases.Fate);
        this.initialise([
            new SimpleStep(game, () => this.discardCharactersWithNoFate()),
            new SimpleStep(game, () => this.removeFateFromCharacters()),
            new SimpleStep(game, () => this.placeFateOnUnclaimedRings()),
            new ActionWindow(this.game, 'Action Window', 'fate'),
            new SimpleStep(game, () => this.readyCards()),
            new SimpleStep(game, () => this.discardFromProvinces()),
            new SimpleStep(game, () => this.returnRings()),
            new SimpleStep(game, () => this.passFirstPlayer())
        ]);
    }

    discardCharactersWithNoFate() {
        for(const player of this.game.getPlayersInFirstPlayerOrder()) {
            this.game.queueSimpleStep(() =>
                this.promptPlayerToDiscard(player, new Set(player.cardsInPlay.filter(characterShouldBeDiscarded)))
            );
        }
    }

    promptPlayerToDiscard(player: Player, cardsToDiscard: Set<DrawCard>) {
        for(const card of cardsToDiscard) {
            if(!characterShouldBeDiscarded(card)) {
                cardsToDiscard.delete(card);
            }
        }

        if(cardsToDiscard.size === 0) {
            return;
        }

        this.game.promptForSelect(player, {
            source: 'Fate Phase',
            activePromptTitle: 'Choose character to discard\n(or click Done to discard all characters with no fate)',
            waitingPromptTitle: 'Waiting for opponent to discard characters with no fate',
            cardCondition: (card: DrawCard) => cardsToDiscard.has(card),
            cardType: CardType.Character,
            controller: Players.Self,
            buttons: [{ text: 'Done', arg: 'cancel' }],
            onSelect: (player: Player, selectedCard: DrawCard) => {
                this.game.applyGameAction(null, { discardFromPlay: selectedCard });

                cardsToDiscard.delete(selectedCard);

                this.game.queueSimpleStep(() => this.promptPlayerToDiscard(player, cardsToDiscard));
                return true;
            },
            onCancel: () => {
                for(const character of cardsToDiscard) {
                    this.game.applyGameAction(null, { discardFromPlay: character });
                }
            }
        });
    }

    removeFateFromCharacters() {
        const context = this.game.getGameContext();
        const events = this.game.applyGameAction(context, {
            removeFate: this.game.findAnyCardsInPlay((card) => card.allowGameAction('removeFate'))
        });
        let processed = false;
        this.game.queueSimpleStep(() => {
            for(const player of this.game.getPlayersInFirstPlayerOrder()) {
                if(!processed) {
                    const numFate = events.filter((a) => !('recipient' in a) || a.recipient === null || a.recipient === undefined).length;
                    const postFunc = player.mostRecentEffect(EffectName.CustomFatePhaseFateRemoval);
                    if(postFunc) {
                        postFunc(player, numFate);
                        processed = true;
                    }
                }
            }
        });
    }

    placeFateOnUnclaimedRings() {
        if(!this.game.rules.fatePhasePutFateOnRings) {
            return;
        }
        const recipients = Object.values(this.game.rings)
            .filter((ring) => ring.isUnclaimed())
            .map((ring) => ({ ring: ring, amount: 1 }));
        this.game.raiseEvent(EventName.OnPlaceFateOnUnclaimedRings, { recipients: recipients }, () => {
            recipients.forEach((recipient) => recipient.ring.modifyFate(recipient.amount));
        });
    }

    discardFromProvinces() {
        for(const player of this.game.getPlayersInFirstPlayerOrder()) {
            this.game.queueSimpleStep(() => this.discardFromProvincesForPlayer(player));
        }
    }

    discardFromProvincesForPlayer(player: Player) {
        let cardsToDiscard: DrawCard[] = [];
        let cardsOnUnbrokenProvinces: DrawCard[] = [];
        for(const location of this.game.getProvinceArray()) {
            const provinceCard = player.getProvinceCardInProvince(location);
            const province = player.getSourceList(location);
            const dynastyCards = province.filter((card) => card.isDynastyCard()).filter((card) => card.isFaceup());
            if(dynastyCards.length > 0 && provinceCard) {
                if(provinceCard.isBroken && this.game.rules.fatePhaseForceDiscardFromBrokenProvinces) {
                    cardsToDiscard = cardsToDiscard.concat(dynastyCards);
                } else {
                    cardsOnUnbrokenProvinces = cardsOnUnbrokenProvinces.concat(dynastyCards);
                }
            }
        }

        if(cardsOnUnbrokenProvinces.length > 0) {
            this.game.promptForSelect(player, {
                source: 'Discard Dynasty Cards',
                mode: TargetMode.Unlimited,
                optional: true,
                activePromptTitle: 'Select dynasty cards to discard',
                waitingPromptTitle: 'Waiting for opponent to discard dynasty cards',
                location: Location.Provinces,
                controller: Players.Self,
                cardCondition: (card) => card.isDrawCard() && cardsOnUnbrokenProvinces.includes(card),
                onSelect: (player: Player, cards) => {
                    cardsToDiscard = cardsToDiscard.concat(cards.filter((card) => card.isDrawCard()));
                    if(cardsToDiscard.length > 0) {
                        this.game.addMessage('{0} discards {1} from their provinces', player, cardsToDiscard);
                        this.game.applyGameAction(this.game.getGameContext(), { discardCard: cardsToDiscard });
                    }
                    return true;
                },
                onCancel: () => {
                    if(cardsToDiscard.length > 0) {
                        this.game.addMessage('{0} discards {1} from their provinces', player, cardsToDiscard);
                        this.game.applyGameAction(this.game.getGameContext(), { discardCard: cardsToDiscard });
                    }
                    return true;
                }
            });
        } else if(cardsToDiscard.length > 0) {
            this.game.addMessage('{0} discards {1} from their provinces', player, cardsToDiscard);
            this.game.applyGameAction(this.game.getGameContext(), { discardCard: cardsToDiscard });
        }

        this.game.queueSimpleStep(() => {
            for(const location of this.game.getProvinceArray(false)) {
                this.game.queueSimpleStep(() => {
                    player.replaceDynastyCard(location);
                    return true;
                });
            }
        });
    }

    readyCards() {
        const cardsToReady = this.game.allCards.filter((card) => card.bowed && card.readiesDuringReadyPhase());
        this.game.actions.ready().resolve(cardsToReady, this.game.getGameContext());
    }

    returnRings() {
        const claimedRings = Object.values(this.game.rings).filter((ring) => ring.claimed);
        this.game.actions.returnRing().resolve(claimedRings, this.game.getGameContext());
    }

    passFirstPlayer() {
        const firstPlayer = this.game.getFirstPlayer();
        if(!firstPlayer) {
            return;
        }
        const otherPlayer = firstPlayer.opponent;
        if(otherPlayer) {
            this.game.raiseEvent(EventName.OnPassFirstPlayer, { player: otherPlayer }, () =>
                this.game.setFirstPlayer(otherPlayer)
            );
        }
    }
}
