import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

class MotoJuro extends DrawCard {
    static id = 'moto-juro';

    setupCardAbilities() {
        this.action({
            title: 'Move this character to the conflict or home from the conflict',
            limit: AbilityDsl.limit.perRound(2),
            gameAction: AbilityDsl.actions.conditional({
                condition: (context: AbilityContext) => context.source.isParticipating(),
                trueGameAction: AbilityDsl.actions.sendHome((context: AbilityContext) => ({ target: context.source })),
                falseGameAction: AbilityDsl.actions.moveToConflict((context: AbilityContext) => ({ target: context.source }))
            })
        });
    }
}


export default MotoJuro;
