import { CardType, Players } from '../../Constants.js';
import { StrongholdCard } from '../../StrongholdCard.js';
import * as costs from '../../costs/index.js';
import { modifyRestrictedAttachmentAmount, reduceNextPlayedCardCost } from '../../effects.js';
import { isReducibleAttachmentPlay } from '../attachmentPlay.js';

export default class IronMountainCastle extends StrongholdCard {
    static id = 'iron-mountain-castle';

    override setupCardAbilities() {
        this.persistentEffect({
            match: (card) => card.isFaction('dragon'),
            targetController: Players.Self,
            effect: modifyRestrictedAttachmentAmount(1)
        });

        this.interrupt('Reduce cost of next attachment')
            .when({
                onAbilityResolverInitiated: (event, context) =>
                    isReducibleAttachmentPlay(event.context) &&
                    event.context.player === context.player &&
                    event.context.target?.controller === context.player &&
                    event.context.target.type === CardType.Character
            })
            .cost(costs.bowSelf())
            .playerLastingEffect((context) => ({
                effect: reduceNextPlayedCardCost(
                    1,
                    (card) => card === context.event.context?.source
                )
            }))
            .chatText('reduce the cost of their next attachment by 1');
    }
}
