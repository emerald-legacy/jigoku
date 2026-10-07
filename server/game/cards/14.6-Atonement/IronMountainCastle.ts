import { CardType, Players } from '../../Constants.js';
import { PlayAttachmentAction } from '../../PlayAttachmentAction.js';
import { StrongholdCard } from '../../StrongholdCard.js';
import * as costs from '../../costs/index.js';
import { modifyRestrictedAttachmentAmount, reduceNextPlayedCardCost } from '../../effects.js';

export default class IronMountainCastle extends StrongholdCard {
    static id = 'iron-mountain-castle';

    setupCardAbilities() {
        this.persistentEffect({
            match: (card) => card.isFaction('dragon'),
            targetController: Players.Self,
            effect: modifyRestrictedAttachmentAmount(1)
        });

        this.interrupt('Reduce cost of next attachment')
            .when({
                onAbilityResolverInitiated: (event, context) => {
                    if(event.context === undefined) {
                        return false;
                    }
                    const ec = event.context;
                    const isAttachment =
                        ec.source.type === CardType.Attachment ||
                        ec.ability instanceof PlayAttachmentAction;
                    return (
                        isAttachment &&
                        ec.player === context.player &&
                        ec.target &&
                        ec.target.controller === context.player &&
                        ec.target.type === CardType.Character &&
                        ec.ability.getReducedCost(ec) > 0
                    );
                }
            })
            .cost(costs.bowSelf())
            .playerLastingEffect((context) => ({
                targetController: context.player,
                effect: reduceNextPlayedCardCost(
                    1,
                    (card) => card === context.event.context?.source
                )
            }))
            .effect('reduce the cost of their next attachment by 1');
    }
}
