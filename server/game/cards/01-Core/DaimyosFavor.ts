import DrawCard from '../../drawcard.js';
import { Durations, CardTypes } from '../../Constants.js';

class DaimyosFavor extends DrawCard {
    static id = 'daimyo-s-favor';

    setupCardAbilities(ability) {
        this.attachmentConditions({
            myControl: true
        });

        this.action({
            title: 'Bow to reduce attachment cost',
            cost: ability.costs.bowSelf(),
            effect: 'reduce the cost of the next attachment they play on {1} by 1',
            effectArgs: context => context.source.parent,
            gameAction: ability.actions.playerLastingEffect(context => ({
                targetController: context.player,
                duration: Durations.UntilEndOfPhase,
                effect: ability.effects.reduceCost({
                    amount: 1,
                    cardType: CardTypes.Attachment,
                    targetCondition: target => target === context.source.parent,
                    limit: ability.limit.fixed(1)
                })
            }))
        });
    }
}


export default DaimyosFavor;
