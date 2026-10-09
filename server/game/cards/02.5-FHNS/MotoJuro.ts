import { perRound } from '../../AbilityLimit.js';
import DrawCard from '../../DrawCard.js';

class MotoJuro extends DrawCard {
    static id = 'moto-juro';

    setupCardAbilities() {
        this.action('Move this character to the conflict or home from the conflict')
            .if((context) => context.source.isDrawCard() && context.source.isParticipating())
                .sendHome((context) => ({ target: context.source }))
            .otherwise()
                .moveToConflict((context) => ({ target: context.source }))
            .limit(perRound(2));
    }
}


export default MotoJuro;
