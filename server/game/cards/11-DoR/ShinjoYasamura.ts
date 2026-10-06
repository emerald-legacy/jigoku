import DrawCard from '../../DrawCard.js';
import { Duration } from '../../Constants.js';
import { cannotBeDeclaredAsDefender } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

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
            .gameAction(cardLastingEffect((context) => ({
                target: context.event.context.target,
                duration: Duration.UntilEndOfPhase,
                effect: cannotBeDeclaredAsDefender()
            })))
            .effect('prevent {1} from defending this phase', (context) => context.event.context.target);
    }
}


export default ShinjoYasamura;
