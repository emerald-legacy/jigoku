import { AllPlayerPrompt } from '../AllPlayerPrompt';
import type Player from '../../player';

class MulliganDynastyPrompt extends AllPlayerPrompt {
    selectedCards: Record<string, any[]>;
    selectableCards: Record<string, any[]>;

    constructor(game: any) {
        super(game);
        this.selectedCards = {};
        this.selectableCards = {};
        game.getPlayers().forEach((player: Player) => this.selectedCards[player.name] = []);
    }

    completionCondition(player: Player): boolean {
        return !!(player as any).takenDynastyMulligan;
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
                this.selectableCards[player.name] = this.game.getProvinceArray(false).map((location: any) => (player as any).getDynastyCardsInProvince(location)).flat();
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

    onCardClicked(player: Player, card: any): boolean {
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

    cardCondition(card: any): boolean {
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
                    if((player as any).dynastyDeck.length > 0) {
                        (player as any).moveCard((player as any).dynastyDeck[0], card.location);
                    }
                }
                for(const card of this.selectedCards[player.name]) {
                    let location = card.location;
                    (player as any).moveCard(card, 'dynasty deck bottom');
                    (player as any).replaceDynastyCard(location);
                }
                (player as any).shuffleDynastyDeck();
                this.game.addMessage('{0} has mulliganed {1} cards from the dynasty deck', player, this.selectedCards[player.name].length);
            } else {
                this.game.addMessage('{0} has kept all dynasty cards', player);
            }
            player.clearSelectedCards();
            player.clearSelectableCards();
            (player as any).takenDynastyMulligan = true;
            return true;
        }
        return false;
    }
}

export default MulliganDynastyPrompt;
