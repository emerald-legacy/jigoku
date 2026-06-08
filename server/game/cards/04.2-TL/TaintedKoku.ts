import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';

class TaintedKoku extends DrawCard {
    static id = 'tainted-koku';

    setupCardAbilities() {
        this.interrupt({
            title: 'Move attachment to another character',
            when: {
                onCardLeavesPlay: (event, context) => event.card === context.source.parent
            },
            target: {
                cardType: CardType.Character,
                cardCondition: (card, context) => Boolean(context.source.parent && card.controller === context.source.parent.controller && card !== context.source.parent),
                gameAction: AbilityDsl.actions.attach(context => ({ attachment: context.source }))
            }
        });
    }
}


export default TaintedKoku;
