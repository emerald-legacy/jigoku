import { msg } from '../../GameChat.js';
import { MulliganDynastyPrompt } from './MulliganDynastyPrompt.js';
import { Location } from '../../Constants.js';
import type Player from '../../Player.js';
import type BaseCard from '../../BaseCard.js';

export class MulliganConflictPrompt extends MulliganDynastyPrompt {
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
        return card.location === Location.Hand;
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to mulligan conflict cards' };
    }

    menuCommand(player: Player, arg: string): boolean {
        if(arg === 'done') {
            if(this.selectedCards[player.name].length > 0) {
                for(const card of this.selectedCards[player.name]) {
                    player.moveCard(card, Location.ConflictDeck, { bottom: true });
                }
                player.drawCardsToHand(this.selectedCards[player.name].length);
                player.shuffleConflictDeck();
                this.game.addMessage(msg`${player} has mulliganed ${this.selectedCards[player.name].length} cards from the conflict deck`);
            } else {
                this.game.addMessage(msg`${player} has kept all conflict cards`);
            }
            this.game.getProvinceArray(false).forEach((location: Location) => {
                const cards = player.getDynastyCardsInProvince(location);
                cards.forEach((card) => {
                    card.facedown = true;
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

