import MulliganDynastyPrompt from './mulligandynastyprompt.js';
import { Locations } from '../../Constants.js';
import type Player from '../../player.js';

class MulliganConflictPrompt extends MulliganDynastyPrompt {
    completionCondition(player: Player): boolean {
        return !!(player as any).takenConflictMulligan;
    }

    activePrompt() {
        return Object.assign(super.activePrompt(), {
            menuTitle: 'Select conflict cards to mulligan',
            promptTitle: 'Conflict Mulligan'
        });
    }

    highlightSelectableCards(): void {
        this.game.getPlayers().forEach((player: Player) => {
            if(!this.selectableCards[player.name]) {
                this.selectableCards[player.name] = (player as any).hand.slice();
            }
            player.setSelectableCards(this.selectableCards[player.name]);
        });
    }

    cardCondition(card: any): boolean {
        return card.location === Locations.Hand;
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to mulligan conflict cards' };
    }

    menuCommand(player: Player, arg: string): boolean {
        if(arg === 'done') {
            if(this.selectedCards[player.name].length > 0) {
                for(const card of this.selectedCards[player.name]) {
                    (player as any).moveCard(card, 'conflict deck bottom');
                }
                (player as any).drawCardsToHand(this.selectedCards[player.name].length);
                (player as any).shuffleConflictDeck();
                this.game.addMessage('{0} has mulliganed {1} cards from the conflict deck', player, this.selectedCards[player.name].length);
            } else {
                this.game.addMessage('{0} has kept all conflict cards', player);
            }
            this.game.getProvinceArray(false).forEach((location: any) => {
                let cards = (player as any).getDynastyCardsInProvince(location);
                cards.forEach((card: any) => {
                    if(card) {
                        card.facedown = true;
                    }
                });
            });
            player.clearSelectedCards();
            player.clearSelectableCards();
            (player as any).takenConflictMulligan = true;
            (this as any).readyToStart = true;
            return true;
        }
        return false;
    }
}

export default MulliganConflictPrompt;
