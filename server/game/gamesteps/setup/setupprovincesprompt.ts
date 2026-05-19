import { AllPlayerPrompt } from '../AllPlayerPrompt.js';
import { Locations } from '../../Constants.js';
import type Player from '../../player.js';

class SetupProvincesPrompt extends AllPlayerPrompt {
    strongholdProvince: Record<string, any>;
    clickedDone: Record<string, boolean>;
    selectedCards: Record<string, any[]>;
    selectableCards: Record<string, any[]>;

    constructor(game: any) {
        super(game);
        this.strongholdProvince = {};
        this.clickedDone = {};
        this.selectedCards = {};
        this.selectableCards = {};
        for(let player of game.getPlayers()) {
            this.selectedCards[player.uuid] = [];
            this.selectableCards[player.uuid] = player.provinceDeck.slice();
        }
    }

    completionCondition(player: Player): boolean {
        return this.clickedDone[player.uuid];
    }

    continue(): boolean {
        if(!this.isComplete()) {
            this.highlightSelectableCards();
        }

        return super.continue();
    }

    highlightSelectableCards(): void {
        this.game.getPlayers().forEach((player: Player) => {
            let cards = this.selectableCards[player.uuid];
            if(!this.strongholdProvince[player.uuid]) {
                cards = cards.filter((card: any) => !card.cannotBeStrongholdProvince());
            }
            player.setSelectableCards(cards);
        });
    }

    activePrompt(player: Player) {
        let menuTitle = 'Choose province order, or press Done to place them at random';
        if(!this.strongholdProvince[player.uuid]) {
            menuTitle = 'Select stronghold province';
        }

        return {
            selectCard: true,
            selectRing: true,
            selectOrder: !!this.strongholdProvince[player.uuid],
            menuTitle: menuTitle,
            buttons: this.strongholdProvince[player.uuid] ? [{ text: 'Done', arg: 'done' }, { text: 'Change stronghold province', arg: 'change' }] : [],
            promptTitle: 'Place Provinces'
        };
    }

    onCardClicked(player: Player, card: any): boolean {
        if(!player || !this.activeCondition(player) || !card) {
            return false;
        } else if(!this.selectableCards[player.uuid].includes(card)) {
            return false;
        } else if(!this.strongholdProvince[player.uuid]) {
            if(card.cannotBeStrongholdProvince()) {
                return false;
            }
            this.strongholdProvince[player.uuid] = card;
            card.inConflict = true;
            this.selectableCards[player.uuid] = this.selectableCards[player.uuid].filter((c: any) => c !== card);
            return true;
        }

        if(!this.selectedCards[player.uuid].includes(card)) {
            this.selectedCards[player.uuid].push(card);
        } else {
            this.selectedCards[player.uuid] = this.selectedCards[player.uuid].filter((c: any) => c !== card);
        }
        player.setSelectedCards(this.selectedCards[player.uuid]);
        return true;
    }

    waitingPrompt() {
        return {
            menuTitle: 'Waiting for opponent to finish selecting provinces'
        };
    }

    menuCommand(player: Player, arg: string): boolean {
        if(arg === 'change' || !this.strongholdProvince[player.uuid]) {
            this.strongholdProvince[player.uuid].inConflict = false;
            this.strongholdProvince[player.uuid] = null;
            this.selectableCards[player.uuid] = (player as any).provinceDeck.slice();
            this.selectedCards[player.uuid] = [];
            return true;
        } else if(arg !== 'done') {
            return false;
        }

        this.strongholdProvince[player.uuid].inConflict = false;
        if(!this.strongholdProvince[player.uuid].startsGameFaceup()) {
            this.strongholdProvince[player.uuid].facedown = true;
        }
        this.clickedDone[player.uuid] = true;
        this.game.addMessage('{0} has placed their provinces', player);
        (player as any).moveCard(this.strongholdProvince[player.uuid], Locations.StrongholdProvince);
        // Shuffle remaining selectable cards using Fisher-Yates
        const shuffled = [...this.selectableCards[player.uuid]];
        for(let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        let provinces = [...new Set(this.selectedCards[player.uuid].concat(shuffled))];
        for(let i = 1; i < 5; i++) {
            let provinceCard = provinces[i - 1];
            if(!provinceCard.startsGameFaceup()) {
                provinceCard.facedown = true;
            }
            (player as any).moveCard(provinceCard, 'province ' + i.toString());
        }
        (player as any).hideProvinceDeck = true;

        return true;
    }
}

export default SetupProvincesPrompt;
