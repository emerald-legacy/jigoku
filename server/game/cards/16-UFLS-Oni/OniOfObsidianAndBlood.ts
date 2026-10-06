import { CardType, Players } from '../../Constants.js';
import { BaseOni } from './_BaseOni.js';
import { discardFromPlay } from '../../GameActions/GameActions.js';
import type BaseCard from '../../BaseCard.js';

export default class OniOfObsidianAndBlood extends BaseOni {
    static id = 'oni-of-obsidian-and-blood';

    public setupCardAbilities() {
        super.setupCardAbilities();
        this.reaction('Discard a character')
            .when({
                afterConflict: (event, context) =>
                    event.conflict.winner === context.source.controller && context.source.isParticipating()
            })
            .target({
                controller: Players.Opponent,
                cardType: CardType.Character,
                cardCondition: (card) => card.isTainted
            }, discardFromPlay());
    }

    public allowAttachment(attachment: BaseCard) {
        return attachment.isFaction('shadowlands') && super.allowAttachment(attachment);
    }
}
