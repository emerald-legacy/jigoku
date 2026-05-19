import DrawCard from '../../drawcard.js';
import { Durations } from '../../Constants.js';

class HirumaSkirmisher extends DrawCard {
    static id = 'hiruma-skirmisher';

    setupCardAbilities(ability) {
        this.reaction({
            title: 'Gain covert until end of phase',
            when: {
                onCharacterEntersPlay: (event, context) => event.card === context.source
            },
            effect: 'give itself Covert until the end of the phase',
            gameAction: ability.actions.cardLastingEffect({
                duration: Durations.UntilEndOfPhase,
                effect: ability.effects.addKeyword('covert')
            })
        });
    }
}


export default HirumaSkirmisher;
