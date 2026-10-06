import DrawCard from '../../DrawCard.js';
import { CardType, Element, Duration } from '../../Constants.js';
import { switchBaseSkills } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

class IsawaHeiko extends DrawCard {
    static id = 'isawa-heiko';

    setupCardAbilities() {
        this.reaction('Switch a character\'s base skills')
            .when({
                onCardPlayed: (event, context) => {
                    return event.card.hasTrait(Element.Water) &&
                        event.player === context.player;
                }
            })
            .target({
                cardType: CardType.Character,
                cardCondition: card => !card.hasDash()
            }, cardLastingEffect({
                duration: Duration.UntilEndOfPhase,
                effect: switchBaseSkills()
            }))
            .effect('switch {0}\'s military and political skill');
    }
}


export default IsawaHeiko;
