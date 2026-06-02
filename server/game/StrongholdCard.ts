import BaseCard from './BaseCard.js';
import { ChildCardManager } from './ChildCardManager.js';
import type DrawCard from './DrawCard.js';
import type Player from './Player.js';
import type { Location } from './Constants.js';

export class StrongholdCard extends BaseCard {
    menu = [{ command: 'bow', text: 'Bow/Ready' }];
    isStronghold = true;
    stealFirstPlayerDuringSetupWithMsg?: string;
    private childCardHost = new ChildCardManager(this);

    get childCards(): DrawCard[] {
        return this.childCardHost.childCards;
    }

    set childCards(value: DrawCard[]) {
        this.childCardHost.childCards = value;
    }

    addChildCard(card: DrawCard, location: Location): void {
        this.childCardHost.add(card, location);
    }

    removeChildCard(card: DrawCard | null, location: Location): void {
        this.childCardHost.remove(card, location);
    }

    getFate(): number {
        return this.cardData.fate ?? 0;
    }

    getStartingHonor(): number {
        return this.cardData.honor ?? 0;
    }

    getInfluence(): number {
        return this.cardData.influence_pool ?? 0;
    }

    getProvinceStrengthBonus(): number {
        return parseInt(this.cardData.strength_bonus ?? '0');
    }

    flipFaceup(): void {
        this.facedown = false;
    }

    getSummary(activePlayer: Player, hideWhenFaceup = false) {
        const baseSummary = super.getSummary(activePlayer, hideWhenFaceup);
        return {
            ...baseSummary,
            isStronghold: this.isStronghold,
            childCards: this.childCards.map((card: BaseCard) => card.getSummary(activePlayer, hideWhenFaceup)),
            bowed: this.bowed
        };
    }
}
