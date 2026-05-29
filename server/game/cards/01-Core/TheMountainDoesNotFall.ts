import DrawCard from '../../DrawCard.js';
import { Durations, CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class TheMountainDoesNotFall extends DrawCard {
    static id = 'the-mountain-does-not-fall';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Choose a character to not bow when defending',
            target: {
                cardType: CardTypes.Character,
                gameAction: ability.actions.cardLastingEffect(context => ({
                    duration: Durations.UntilEndOfPhase,
                    condition: () => context.target.isDefending(),
                    effect: ability.effects.doesNotBow()
                }))
            },
            effect: 'make {0} not bow as a defender',
            max: ability.limit.perRound(1)
        });
    }
}


export default TheMountainDoesNotFall;
