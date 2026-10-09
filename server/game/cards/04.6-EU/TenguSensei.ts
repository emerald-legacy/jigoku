import { msg } from '../../GameChat.js';
import { cannotBeDeclaredAsAttacker } from '../../effects.js';
import DrawCard from '../../DrawCard.js';
import { Duration } from '../../Constants.js';

class TenguSensei extends DrawCard {
    static id = 'tengu-sensei';

    setupCardAbilities() {
        this.reaction('Prevent a character from attacking this phase')
            .when({
                onCovertResolved: (event, context) => {
                    return (event.card === context.source || (Array.isArray(event.card) && event.card.includes(context.source)));
                }
            })
            .chatText((context) => msg`prevent ${context.event.context.target} from attacking this phase`)
            .cardLastingEffect((context) => ({
                target: context.event.context.target ?? [],
                duration: Duration.UntilEndOfPhase,
                effect: cannotBeDeclaredAsAttacker()
            }));
    }
}


export default TenguSensei;
