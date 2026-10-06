import AbilityDsl from '../../abilitydsl.js';
import { moveToConflict, sendHome } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

class MotoJuro extends DrawCard {
    static id = 'moto-juro';

    setupCardAbilities() {
        this.action('Move this character to the conflict or home from the conflict')
            .if((context) => context.source.isDrawCard() && context.source.isParticipating())
                .gameAction(sendHome((context) => ({ target: context.source })))
            .otherwise()
                .gameAction(moveToConflict((context) => ({ target: context.source })))
            .limit(AbilityDsl.limit.perRound(2));
    }
}


export default MotoJuro;
