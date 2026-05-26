import BaseCard from './basecard.js';
import type Player from './player.js';

export class StrongholdCard extends BaseCard {
    menu = [{ command: 'bow', text: 'Bow/Ready' }];
    bowed = false;
    isStronghold = true;
    stealFirstPlayerDuringSetupWithMsg?: string;

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

    bow(): void {
        this.bowed = true;
    }

    ready(): void {
        this.bowed = false;
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
