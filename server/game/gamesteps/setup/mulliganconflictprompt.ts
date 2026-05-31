import MulliganDynastyPrompt from './mulligandynastyprompt.js';
import { Locations } from '../../Constants.js';
import type Player from '../../Player.js';
import type BaseCard from '../../BaseCard.js';
import type DrawCard from '../../DrawCard.js';

class MulliganConflictPrompt extends MulliganDynastyPrompt {
    readyToStart?: boolean;

    completionCondition(player: Player): boolean {
        return !!player.takenConflictMulligan;
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
                this.selectableCards[player.name] = player.hand.slice();
            }
            player.setSelectableCards(this.selectableCards[player.name]);
        });
    }

    cardCondition(card: BaseCard): boolean {
        return card.location === Locations.Hand;
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to mulligan conflict cards' };
    }

    menuCommand(player: Player, arg: string): boolean {
        if(arg === 'done') {
            if(this.selectedCards[player.name].length > 0) {
                for(const card of this.selectedCards[player.name]) {
                    player.moveCard(card, 'conflict deck bottom');
                }
                player.drawCardsToHand(this.selectedCards[player.name].length);
                player.shuffleConflictDeck();
                this.game.addMessage('{0} has mulliganed {1} cards from the conflict deck', player, this.selectedCards[player.name].length);
            } else {
                this.game.addMessage('{0} has kept all conflict cards', player);
            }
            this.game.getProvinceArray(false).forEach((location: Locations) => {
                let cards = player.getDynastyCardsInProvince(location);
                cards.forEach((card: DrawCard) => {
                    if(card) {
                        card.facedown = true;
                    }
                });
            });
            player.clearSelectedCards();
            player.clearSelectableCards();
            player.takenConflictMulligan = true;
            this.readyToStart = true;
            return true;
        }
        return false;
    }
}

export default MulliganConflictPrompt;
