import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';

class IAmReady extends DrawCard {
    static id = 'i-am-ready';

    setupCardAbilities(ability) {
        this.action({
            title: 'Ready a character',
            cost: ability.costs.removeFate({
                cardType: CardTypes.Character,
                cardCondition: card => card.isFaction('unicorn') && card.bowed
            }),
            cannotBeMirrored: true,
            effect: 'ready {1}',
            effectArgs: context => context.costs.removeFate,
            handler: context => ability.actions.ready().resolve(context.costs.removeFate, context)
        });
    }
}


export default IAmReady;
