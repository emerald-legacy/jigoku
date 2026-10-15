import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { Duration } from '../../Constants.js';
import { cannotBeDeclaredAsDefender } from '../../effects.js';

class ShinjoYasamura extends DrawCard {
    static id = 'shinjo-yasamura';

    setupCardAbilities() {
        this.reaction('Prevent a character from defending this phase')
            .when({
                onCovertResolved: (event, context) =>
                    (event.card === context.source ||
                        (Array.isArray(event.card) && event.card.includes(context.source))) &&
                    !!event.context?.target?.isDrawCard() && event.context.target.covert
            })
            .cardLastingEffect((context) => ({
                target: context.event.context.target,
                duration: Duration.UntilEndOfPhase,
                effect: cannotBeDeclaredAsDefender()
            }))
            .chatText((context) => msg`prevent ${context.event.context.target} from defending this phase`);
    }
}


export default ShinjoYasamura;
