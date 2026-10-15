import { perRound } from '../../AbilityLimit.js';
import DrawCard from '../../DrawCard.js';

class MotoJuro extends DrawCard {
    static id = 'moto-juro';

    override setupCardAbilities() {
        this.action('Move this character to the conflict or home from the conflict')
            .if((context) => context.source.isDrawCard() && context.source.isParticipating())
                .sendHome()
            .otherwise()
                .moveToConflict()
            .limit(perRound(2));
    }
}


export default MotoJuro;
