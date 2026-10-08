import DrawCard from '../../DrawCard.js';
import { Duration } from '../../Constants.js';
import { addKeyword } from '../../effects.js';

class HirumaSkirmisher extends DrawCard {
    static id = 'hiruma-skirmisher';

    setupCardAbilities() {
        this.reaction('Gain covert until end of phase')
            .when({
                onCharacterEntersPlay: (event, context) => event.card === context.source
            })
            .cardLastingEffect({
                duration: Duration.UntilEndOfPhase,
                effect: addKeyword('covert')
            })
            .chatText('give itself Covert until the end of the phase');
    }
}


export default HirumaSkirmisher;
