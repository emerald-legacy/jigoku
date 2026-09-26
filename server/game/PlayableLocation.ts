import type { Location, PlayType } from './Constants.js';
import type BaseCard from './BaseCard.js';
import type DrawCard from './DrawCard.js';
import type Player from './Player.js';

export class PlayableLocation {
    public constructor(
        public playingType: PlayType,
        private player: Player,
        private location: Location,
        public cards = new Set<DrawCard>()
    ) {}

    public contains(card: BaseCard) {
        const cards: ReadonlySet<BaseCard> = this.cards;
        if(cards.size > 0 && !cards.has(card)) {
            return false;
        }

        return this.player.getSourceList(this.location).includes(card);
    }
}
