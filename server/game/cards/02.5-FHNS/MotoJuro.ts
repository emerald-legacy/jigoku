import AbilityDsl from '../../abilitydsl.js';
import { conditional, moveToConflict, sendHome } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

class MotoJuro extends DrawCard {
    static id = 'moto-juro';

    setupCardAbilities() {
        this.action('Move this character to the conflict or home from the conflict')
            .gameAction(conditional({
                condition: (context) => context.source.isDrawCard() && context.source.isParticipating(),
                trueGameAction: sendHome((context) => ({ target: context.source })),
                falseGameAction: moveToConflict((context) => ({ target: context.source }))
            }))
            .limit(AbilityDsl.limit.perRound(2));
    }
}


export default MotoJuro;
