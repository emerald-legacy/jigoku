import { ConflictType } from './Constants.js';
import type Game from './Game.js';
import type Player from './Player.js';
import type { PlayerState } from './Player.js';
import type BaseCard from './BaseCard.js';
import type { CardSummary } from './BaseCard.js';

export class PlayerStateBuilder {
    constructor(private readonly player: Player, private readonly game: Game) {}

    getSummaryForHand(list: BaseCard[], activePlayer: Player, hideWhenFaceup: boolean): CardSummary[] {
        if(this.player.optionSettings.sortHandByName) {
            return this.getSortedSummaryForCardList(list, activePlayer, hideWhenFaceup);
        }
        return this.getSummaryForCardList(list, activePlayer, hideWhenFaceup);
    }

    getSummaryForCardList(list: BaseCard[], activePlayer: Player, hideWhenFaceup?: boolean): CardSummary[] {
        return list.map((card: BaseCard) => {
            return card.getSummary(activePlayer, hideWhenFaceup ?? false);
        });
    }

    getSortedSummaryForCardList(list: BaseCard[], activePlayer: Player, hideWhenFaceup?: boolean): CardSummary[] {
        const cards = list.slice();
        cards.sort((a: BaseCard, b: BaseCard) => a.printedName.localeCompare(b.printedName));

        return cards.map((card: BaseCard) => {
            return card.getSummary(activePlayer, hideWhenFaceup ?? false);
        });
    }

    getStats() {
        const player = this.player;
        return {
            fate: player.fate,
            honor: player.getTotalHonor(),
            conflictsRemaining: player.getConflictOpportunities(),
            militaryRemaining: player.getRemainingConflictOpportunitiesForType(ConflictType.Military),
            politicalRemaining: player.getRemainingConflictOpportunitiesForType(ConflictType.Political)
        };
    }

    getState(activePlayer: Player): PlayerState {
        const player = this.player;
        const isActivePlayer = activePlayer === player;
        const promptState = isActivePlayer ? player.promptState.getState() : {};
        const state: PlayerState = {
            cardPiles: {
                cardsInPlay: this.getSummaryForCardList(player.cardsInPlay, activePlayer),
                conflictDiscardPile: this.getSummaryForCardList(player.conflictDiscardPile, activePlayer),
                dynastyDiscardPile: this.getSummaryForCardList(player.dynastyDiscardPile, activePlayer),
                hand: this.getSummaryForHand(player.hand, activePlayer, true),
                removedFromGame: this.getSummaryForCardList(player.removedFromGame, activePlayer),
                provinceDeck: this.getSummaryForCardList(player.provinceDeck, activePlayer, true)
            },
            cardsPlayedThisConflict: this.game.currentConflict
                ? this.game.currentConflict.getNumberOfCardsPlayed(player)
                : NaN,
            disconnected: player.disconnected,
            faction: player.faction,
            firstPlayer: player.firstPlayer,
            hideProvinceDeck: player.hideProvinceDeck,
            id: player.id,
            imperialFavor: player.imperialFavor,
            left: player.left,
            name: player.name,
            numConflictCards: player.conflictDeck.length,
            numDynastyCards: player.dynastyDeck.length,
            numProvinceCards: player.provinceDeck.length,
            optionSettings: player.optionSettings,
            phase: this.game.currentPhase,
            promptedActionWindows: player.promptedActionWindows,
            provinces: {
                one: this.getSummaryForCardList(player.provinceOne, activePlayer, !player.readyToStart),
                two: this.getSummaryForCardList(player.provinceTwo, activePlayer, !player.readyToStart),
                three: this.getSummaryForCardList(player.provinceThree, activePlayer, !player.readyToStart),
                four: this.getSummaryForCardList(player.provinceFour, activePlayer, !player.readyToStart)
            },
            showBid: player.showBid,
            stats: this.getStats(),
            timerSettings: player.timerSettings,
            strongholdProvince: this.getSummaryForCardList(player.strongholdProvince, activePlayer),
            user: {
                username: player.user.username,
                emailHash: player.user.emailHash,
                settings: player.user.settings
            }
        };

        if(player.additionalPiles && Object.keys(player.additionalPiles)) {
            Object.keys(player.additionalPiles).forEach((key) => {
                if(player.additionalPiles[key].cards.length > 0) {
                    state.cardPiles[key] = this.getSummaryForCardList(player.additionalPiles[key].cards, activePlayer);
                }
            });
        }

        if(player.showConflict) {
            state.showConflictDeck = true;
            state.cardPiles.conflictDeck = this.getSummaryForCardList(player.conflictDeck, activePlayer);
        }

        if(player.showDynasty) {
            state.showDynastyDeck = true;
            state.cardPiles.dynastyDeck = this.getSummaryForCardList(player.dynastyDeck, activePlayer);
        }

        if(player.role) {
            state.role = player.role.getSummary(activePlayer);
        }

        if(player.stronghold) {
            state.stronghold = player.stronghold.getSummary(activePlayer);
        }

        if(player.conflictDeck[0]) {
            state.conflictDeckTopCard = player.isTopConflictCardShown(activePlayer)
                ? player.conflictDeck[0].getSummary(activePlayer)
                : { facedown: true, ...activePlayer.getCardSelectionState(player.conflictDeck[0]) };
        }

        if(player.dynastyDeck[0]) {
            state.dynastyDeckTopCard = player.isTopDynastyCardShown(activePlayer)
                ? player.dynastyDeck[0].getSummary(activePlayer)
                : { facedown: true, ...activePlayer.getCardSelectionState(player.dynastyDeck[0]) };
        }

        if(player.clock) {
            state.clock = player.clock.getState();
        }

        return Object.assign(state, promptState);
    }

    getShortSummary() {
        return {
            name: this.player.name,
            faction: this.player.faction
        };
    }
}
