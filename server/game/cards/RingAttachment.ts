import type BaseCard from '../BaseCard.js';
import { CardType } from '../Constants.js';
import DrawCard from '../DrawCard.js';
import type Ring from '../Ring.js';

export class RingAttachment extends DrawCard {
    public canPlayOn(source: BaseCard | Ring) {
        return source.isRing() && this.type === CardType.Attachment;
    }

    public canAttach(parent?: BaseCard | Ring) {
        return !!parent?.isRing() && this.type === CardType.Attachment;
    }

    public mustAttachToRing() {
        return this.type === CardType.Attachment;
    }
}
