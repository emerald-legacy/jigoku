import DrawCard from '../../DrawCard.js';
import { CardTypes, Elements, Durations } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class IsawaHeiko extends DrawCard {
    static id = 'isawa-heiko';

    setupCardAbilities() {
        this.reaction({
            title: 'Switch a character\'s base skills',
            when: {
                onCardPlayed: (event, context) => {
                    return event.card.hasTrait(Elements.Water) &&
                        event.player === context.player;
                }
            },
            target: {
                cardType: CardTypes.Character,
                cardCondition: card => !card.hasDash(),
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    duration: Durations.UntilEndOfPhase,
                    effect: AbilityDsl.effects.switchBaseSkills()
                })
            },
            effect: 'switch {0}\'s military and political skill'
        });
    }
}


export default IsawaHeiko;
