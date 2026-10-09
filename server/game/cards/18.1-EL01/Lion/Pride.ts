import { CardType, Players } from '../../../Constants.js';
import { StrongholdCard } from '../../../StrongholdCard.js';
import * as costs from '../../../costs/index.js';
import { handler } from '../../../GameActions/GameActions.js';
import { attachTopConflictCardAsSoldier, soldierAttachCheck } from '../../attachTopConflictCardAsSoldier.js';

export default class Pride extends StrongholdCard {
    static id = 'pride';

    setupCardAbilities() {
        const canAttachSoldier = soldierAttachCheck(this.controller);

        this.action('Give a character a +1/+1 attachment')
            .cost(costs.bowSelf())
            .condition((context) => context.player.conflictDeck.length > 0)
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card, context) =>
                    card.attachments.filter((a) => a.hasTrait('follower')).length === 0 &&
                    canAttachSoldier(card, context)
            }, handler({
                handler: (context) => attachTopConflictCardAsSoldier(context, context.target)
            }))
            .chatText('attach the top card of their conflict deck to {0} as a +1/+1 attachment');
    }
}
