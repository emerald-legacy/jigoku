import type { Location, PlayType } from './Constants.js';
import type DrawCard from './DrawCard.js';
import type Player from './Player.js';

export class PlayableLocation {
    public constructor(
        public playingType: PlayType,
        private player: Player,
        private location: Location,
        public cards = new Set<DrawCard>()
    ) {}

    public contains(card: DrawCard) {
        if(this.cards.size > 0 && !this.cards.has(card)) {
            return false;
        }

        return this.player.getSourceList(this.location).includes(card);
    }
}
