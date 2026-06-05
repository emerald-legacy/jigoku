import AbilityDsl from './abilitydsl.js';
import type { AbilityContext } from './AbilityContext.js';
import { Duration, CardType } from './Constants.js';
import { PlayAttachmentAction } from './PlayAttachmentAction.js';
import DrawCard from './DrawCard.js';

export class PlayCharacterAsAttachment extends PlayAttachmentAction {
    constructor(card: DrawCard) {
        super(card, true);
        this.title = `Play ${card.name} as an attachment`;
    }

    public executeHandler(context: AbilityContext<DrawCard>) {
        AbilityDsl.actions
            .cardLastingEffect({
                duration: Duration.Custom,
                canChangeZoneOnce: true,
                effect: AbilityDsl.effects.changeType(CardType.Attachment)
            })
            .resolve(this.card, context);
        super.executeHandler(context);
    }
}
