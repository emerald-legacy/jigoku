import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { Duration, CardType } from '../../Constants.js';

class DaimyosFavor extends DrawCard {
    static id = 'daimyo-s-favor';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.attachmentConditions({
            myControl: true
        });

        this.action({
            title: 'Bow to reduce attachment cost',
            cost: ability.costs.bowSelf(),
            effect: 'reduce the cost of the next attachment they play on {1} by 1',
            effectArgs: context => context.source.parent as any,
            gameAction: ability.actions.playerLastingEffect(context => ({
                targetController: context.player,
                duration: Duration.UntilEndOfPhase,
                effect: ability.effects.reduceCost({
                    amount: 1,
                    cardType: CardType.Attachment,
                    targetCondition: (target: any) => target === context.source.parent,
                    limit: ability.limit.fixed(1)
                })
            }))
        });
    }
}


export default DaimyosFavor;
