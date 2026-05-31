import type BaseAction from '../../BaseAction.js';
import { CardTypes, Players } from '../../Constants.js';
import { PlayAttachmentAction } from '../../PlayAttachmentAction.js';
import { StrongholdCard } from '../../StrongholdCard.js';
import AbilityDsl from '../../abilitydsl.js';
import type DrawCard from '../../DrawCard.js';

export default class IronMountainCastle extends StrongholdCard {
    static id = 'iron-mountain-castle';

    setupCardAbilities() {
        this.persistentEffect({
            match: (card) => card.isFaction('dragon'),
            targetController: Players.Self,
            effect: AbilityDsl.effects.modifyRestrictedAttachmentAmount(1)
        });

        this.interrupt({
            title: 'Reduce cost of next attachment',
            when: {
                onAbilityResolverInitiated: (event, context) => {
                    if(event.context === undefined) {
                        return false;
                    }
                    const ec = event.context;
                    const isAttachment =
                        ec.source.type === CardTypes.Attachment ||
                        ec.ability instanceof PlayAttachmentAction;
                    return (
                        isAttachment &&
                        ec.player === context.player &&
                        ec.target &&
                        ec.target.controller === context.player &&
                        ec.target.type === CardTypes.Character &&
                        (ec.ability as BaseAction).getReducedCost(ec) > 0
                    );
                }
            },
            cost: AbilityDsl.costs.bowSelf(),
            effect: 'reduce the cost of their next attachment by 1',
            gameAction: AbilityDsl.actions.playerLastingEffect((context) => ({
                targetController: context.player,
                effect: AbilityDsl.effects.reduceNextPlayedCardCost(
                    1,
                    (card: DrawCard) => card === context.event.context.source
                )
            }))
        });
    }
}
