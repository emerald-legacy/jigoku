import { AllPlayerPrompt } from '../AllPlayerPrompt.js';
import type BaseCard from '../../basecard.js';
import type DrawCard from '../../drawcard.js';
import type Game from '../../game.js';
import type Player from '../../player.js';

class MulliganDynastyPrompt extends AllPlayerPrompt {
    selectedCards: Record<string, DrawCard[]>;
    selectableCards: Record<string, DrawCard[]>;

    constructor(game: Game) {
        super(game);
        this.selectedCards = {};
        this.selectableCards = {};
        game.getPlayers().forEach((player: Player) => this.selectedCards[player.name] = []);
    }

    completionCondition(player: Player): boolean {
        return player.takenDynastyMulligan;
    }

    continue(): boolean {
        if(!this.isComplete()) {
            this.highlightSelectableCards();
        }

        return super.continue();
    }

    highlightSelectableCards(): void {
        this.game.getPlayers().forEach((player: Player) => {
            if(!this.selectableCards[player.name]) {
                this.selectableCards[player.name] = this.game.getProvinceArray(false).map((location: string) => player.getDynastyCardsInProvince(location)).flat();
            }
            player.setSelectableCards(this.selectableCards[player.name]);
        });
    }

    activePrompt() {
        return {
            selectCard: true,
            selectRing: true,
            menuTitle: 'Select dynasty cards to mulligan',
            buttons: [{ text: 'Done', arg: 'done' }],
            promptTitle: 'Dynasty Mulligan'
        };
    }

    onCardClicked(player: Player, card: DrawCard): boolean {
        if(!player || !this.activeCondition(player) || !card) {
            return false;
        }
        if(!this.cardCondition(card)) {
            return false;
        }

        if(!this.selectedCards[player.name].includes(card)) {
            this.selectedCards[player.name].push(card);
        } else {
            this.selectedCards[player.name] = this.selectedCards[player.name].filter(c => c !== card);
        }
        player.setSelectedCards(this.selectedCards[player.name]);

        return true;
    }

    cardCondition(card: BaseCard): boolean {
        return card.isDynasty && card.isInProvince();
    }

    waitingPrompt() {
        return {
            menuTitle: 'Waiting for opponent to mulligan dynasty cards'
        };
    }

    menuCommand(player: Player, arg: string): boolean {
        if(arg === 'done') {
            if(this.selectedCards[player.name].length > 0) {
                for(const card of this.selectedCards[player.name]) {
                    if(player.dynastyDeck.length > 0) {
                        player.moveCard(player.dynastyDeck[0], card.location);
                    }
                }
                for(const card of this.selectedCards[player.name]) {
                    let location = card.location;
                    player.moveCard(card, 'dynasty deck bottom');
                    player.replaceDynastyCard(location);
                }
                player.shuffleDynastyDeck();
                this.game.addMessage('{0} has mulliganed {1} cards from the dynasty deck', player, this.selectedCards[player.name].length);
            } else {
                this.game.addMessage('{0} has kept all dynasty cards', player);
            }
            player.clearSelectedCards();
            player.clearSelectableCards();
            player.takenDynastyMulligan = true;
            return true;
        }
        return false;
    }
}

export default MulliganDynastyPrompt;
