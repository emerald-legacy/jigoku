import DrawCard from '../../drawcard.js';
import { Durations } from '../../Constants.js';

class TenguSensei extends DrawCard {
    static id = 'tengu-sensei';

    setupCardAbilities(ability) {
        this.reaction({
            title: 'Prevent a character from attacking this phase',
            when: {
                onCovertResolved: (event, context) => {
                    return (event.card === context.source || (Array.isArray(event.card) && event.card.includes(context.source)));
                }
            },
            effect: 'prevent {1} from attacking this phase',
            effectArgs: context => {
                return context.event.context.target;
            },
            gameAction: ability.actions.cardLastingEffect(context => {
                return ({
                    target: context.event.context.target,
                    duration: Durations.UntilEndOfPhase,
                    effect: ability.effects.cardCannot('declareAsAttacker')
                });
            })
        });
    }
}


export default TenguSensei;
