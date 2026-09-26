import DrawCard from '../../DrawCard.js';
import { Duration } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class HirumaSkirmisher extends DrawCard {
    static id = 'hiruma-skirmisher';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction('Gain covert until end of phase')
            .when({
                onCharacterEntersPlay: (event, context) => event.card === context.source
            })
            .gameAction(ability.actions.cardLastingEffect({
                duration: Duration.UntilEndOfPhase,
                effect: ability.effects.addKeyword('covert')
            }))
            .effect('give itself Covert until the end of the phase');
    }
}


export default HirumaSkirmisher;
