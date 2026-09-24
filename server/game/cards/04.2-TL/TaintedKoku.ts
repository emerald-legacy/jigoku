import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';

class TaintedKoku extends DrawCard {
    static id = 'tainted-koku';

    setupCardAbilities() {
        this.interrupt({
            title: 'Move attachment to another character',
            when: {
                onCardLeavesPlay: (event, context) => event.card === context.source.parentCharacter
            },
            target: {
                cardType: CardType.Character,
                cardCondition: (card, context) => Boolean(context.source.parentCharacter && card.controller === context.source.parentCharacter.controller && card !== context.source.parentCharacter),
                gameAction: AbilityDsl.actions.attach((context: AbilityContext<DrawCard, DrawCard>) => ({ attachment: context.source }))
            }
        });
    }
}


export default TaintedKoku;
