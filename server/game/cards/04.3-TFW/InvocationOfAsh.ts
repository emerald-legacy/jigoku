import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Players, CardTypes } from '../../Constants.js';

class InvocationOfAsh extends DrawCard {
    static id = 'invocation-of-ash';

    setupCardAbilities() {
        this.action({
            title: 'Move to another character',
            cost: AbilityDsl.costs.payHonor(1),
            target: {
                cardType: CardTypes.Character,
                controller: Players.Self,
                gameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.attach(context => ({ attachment: context.source })),
                    AbilityDsl.actions.removeFate()
                ])
            },
            effect: 'move {1} to {0}, then remove a fate from {0}',
            effectArgs: context => context.source
        });
    }
}


export default InvocationOfAsh;
