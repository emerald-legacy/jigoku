import type BaseCard from './BaseCard.js';
import type DrawCard from './DrawCard.js';
import type { Location } from './Constants.js';

export class ChildCardManager {
    childCards: DrawCard[] = [];

    constructor(private readonly host: BaseCard) {}

    add(card: DrawCard, location: Location): void {
        this.childCards.push(card);
        this.host.controller.moveCard(card, location);
    }

    remove(card: DrawCard | null, location: Location): void {
        if(!card) {
            return;
        }
        this.childCards = this.childCards.filter((a) => a !== card);
        this.host.controller.moveCard(card, location);
    }
}
