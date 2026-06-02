import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';
import type BaseCard from '../../BaseCard.js';
import DrawCard from '../../DrawCard.js';
import { Duration } from '../../Constants.js';

class TenguSensei extends DrawCard {
    static id = 'tengu-sensei';

    setupCardAbilities() {
        this.reaction({
            title: 'Prevent a character from attacking this phase',
            when: {
                onCovertResolved: (event, context) => {
                    return (event.card === context.source || (Array.isArray(event.card) && event.card.includes(context.source)));
                }
            },
            effect: 'prevent {1} from attacking this phase',
            effectArgs: context => {
                return (context.event.context as AbilityContext).target as BaseCard;
            },
            gameAction: AbilityDsl.actions.cardLastingEffect(context => {
                return ({
                    target: (context.event.context as AbilityContext).target,
                    duration: Duration.UntilEndOfPhase,
                    effect: AbilityDsl.effects.cardCannot('declareAsAttacker')
                });
            })
        });
    }
}


export default TenguSensei;
