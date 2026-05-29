import type BaseCard from './BaseCard.js';
import type DrawCard from './DrawCard.js';
import type { Locations } from './Constants.js';

export interface CanHostChildCards {
    childCards: DrawCard[];
    addChildCard(card: DrawCard, location: Locations): void;
    removeChildCard(card: DrawCard | null, location: Locations): void;
}

export class ChildCardManager {
    childCards: DrawCard[] = [];

    constructor(private readonly host: BaseCard) {}

    add(card: DrawCard, location: Locations): void {
        this.childCards.push(card);
        this.host.controller.moveCard(card, location);
    }

    remove(card: DrawCard | null, location: Locations): void {
        if(!card) {
            return;
        }
        this.childCards = this.childCards.filter((a) => a !== card);
        this.host.controller.moveCard(card, location);
    }
}
