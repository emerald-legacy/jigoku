import { EventNames, Locations, Phases, Players } from '../Constants.js';
import { ready, returnRing } from '../GameActions/GameActions.js';
import type DrawCard from '../DrawCard.js';
import type Game from '../Game.js';
import type Player from '../Player.js';
import { Phase } from './Phase.js';
import { SimpleStep } from './SimpleStep.js';
import ActionWindow from './actionwindow.js';
import { EndRoundPrompt } from './regroup/EndRoundPrompt.js';

/**
 * V Regroup Phase
 * 5.1 Regroup phase begins.
 *     ACTION WINDOW
 * 5.2 Ready cards.
 * 5.3 Discard from provinces.
 * 5.4 Return rings.
 * 5.5 Pass first player token.
 * 5.6 Regroup phase ends.
 */
export class RegroupPhase extends Phase {
    constructor(game: Game) {
        super(game, Phases.Regroup);
        this.initialise([
            new ActionWindow(this.game, 'Action Window', 'regroup'),
            new SimpleStep(game, () => this.readyCards()),
            new SimpleStep(game, () => this.discardFromProvinces()),
            new SimpleStep(game, () => this.returnRings()),
            new SimpleStep(game, () => this.passFirstPlayer()),
            new EndRoundPrompt(game),
            new SimpleStep(game, () => this.roundEnded())
        ]);
    }

    readyCards() {
        const cardsToReady = this.game.allCards.filter((card) => card.bowed && card.readiesDuringReadyPhase());
        ready().resolve(cardsToReady, this.game.getFrameworkContext());
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
            const dynastyCards = province.filter((card) => card.isDynasty && card.isFaceup());
            if(dynastyCards.length > 0 && provinceCard) {
                if(provinceCard.isBroken) {
                    cardsToDiscard = cardsToDiscard.concat(dynastyCards);
                } else {
                    cardsOnUnbrokenProvinces = cardsOnUnbrokenProvinces.concat(dynastyCards);
                }
            }
        }

        if(cardsOnUnbrokenProvinces.length > 0) {
            this.game.promptForSelect(player, {
                source: 'Discard Dynasty Cards',
                numCards: 0,
                multiSelect: true,
                optional: true,
                activePromptTitle: 'Select dynasty cards to discard',
                waitingPromptTitle: 'Waiting for opponent to discard dynasty cards',
                location: Locations.Provinces,
                controller: Players.Self,
                cardCondition: (card: DrawCard) => cardsOnUnbrokenProvinces.includes(card),
                onSelect: (player: Player, cards: DrawCard[]) => {
                    cardsToDiscard = cardsToDiscard.concat(cards);
                    if(cardsToDiscard.length > 0) {
                        this.game.addMessage('{0} discards {1} from their provinces', player, cardsToDiscard);
                        this.game.applyGameAction(this.game.getFrameworkContext(), { discardCard: cardsToDiscard });
                    }
                    return true;
                },
                onCancel: () => {
                    if(cardsToDiscard.length > 0) {
                        this.game.addMessage('{0} discards {1} from their provinces', player, cardsToDiscard);
                        this.game.applyGameAction(this.game.getFrameworkContext(), { discardCard: cardsToDiscard });
                    }
                    return true;
                }
            });
        } else if(cardsToDiscard.length > 0) {
            this.game.addMessage('{0} discards {1} from their provinces', player, cardsToDiscard);
            this.game.applyGameAction(this.game.getFrameworkContext(), { discardCard: cardsToDiscard });
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

    returnRings() {
        const claimedRings = Object.values(this.game.rings).filter((ring) => ring.claimed);
        returnRing().resolve(claimedRings, this.game.getFrameworkContext());
    }

    passFirstPlayer() {
        const firstPlayer = this.game.getFirstPlayer();
        if(!firstPlayer) {
            return;
        }
        const otherPlayer = this.game.getOtherPlayer(firstPlayer);
        if(otherPlayer) {
            this.game.raiseEvent(EventNames.OnPassFirstPlayer, { player: otherPlayer }, () =>
                this.game.setFirstPlayer(otherPlayer)
            );
        }
    }

    roundEnded() {
        this.game.raiseEvent(EventNames.OnRoundEnded);
    }
}
