import AbilityDsl from './abilitydsl.js';
import { Durations, CardTypes } from './Constants.js';
import { PlayAttachmentAction } from './PlayAttachmentAction.js';
import DrawCard from './DrawCard.js';

export class PlayCharacterAsAttachment extends PlayAttachmentAction {
    constructor(card: DrawCard) {
        super(card, true);
        this.title = `Play ${card.name} as an attachment`;
    }

    public executeHandler(context: any) {
        AbilityDsl.actions
            .cardLastingEffect({
                duration: Durations.Custom,
                canChangeZoneOnce: true,
                effect: AbilityDsl.effects.changeType(CardTypes.Attachment)
            })
            .resolve(this.card, context);
        super.executeHandler(context);
    }
}
