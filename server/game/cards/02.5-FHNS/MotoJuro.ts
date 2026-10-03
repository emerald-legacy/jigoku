import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

class MotoJuro extends DrawCard {
    static id = 'moto-juro';

    setupCardAbilities() {
        this.action('Move this character to the conflict or home from the conflict')
            .gameAction(AbilityDsl.actions.conditional({
                condition: (context) => context.source.isDrawCard() && context.source.isParticipating(),
                trueGameAction: AbilityDsl.actions.sendHome((context) => ({ target: context.source })),
                falseGameAction: AbilityDsl.actions.moveToConflict((context) => ({ target: context.source }))
            }))
            .limit(AbilityDsl.limit.perRound(2));
    }
}


export default MotoJuro;
