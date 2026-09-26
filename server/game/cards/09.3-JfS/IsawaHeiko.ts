import DrawCard from '../../DrawCard.js';
import { CardType, Element, Duration } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

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
            .target('target', {
                cardType: CardType.Character,
                cardCondition: card => !card.hasDash()
            }, AbilityDsl.actions.cardLastingEffect({
                duration: Duration.UntilEndOfPhase,
                effect: AbilityDsl.effects.switchBaseSkills()
            }))
            .effect('switch {0}\'s military and political skill');
    }
}


export default IsawaHeiko;
