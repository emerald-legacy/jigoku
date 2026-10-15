import { addKeyword, statusTokensDoNotDecreaseSkill } from '../../../effects.js';
import { Phase } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class TheLionsShadow extends DrawCard {
    static id = 'the-lion-s-shadow';

    public setupCardAbilities() {
        this.attachmentConditions({
            limitTrait: { title: 1 },
            trait: ['courtier', 'scout']
        });

        this.persistentEffect({
            condition: (context) => context.game.currentPhase === Phase.Fate,
            effect: addKeyword('ancestral')
        });

        this.whileAttached({
            effect: statusTokensDoNotDecreaseSkill()
        });

        this.whileAttached({
            condition: (context) =>
                !!context.source.parentCharacter?.isAttacking() &&
                context.game.currentConflict?.getNumberOfParticipantsFor('attacker') === 1,
            effect: addKeyword('covert')
        });
    }
}
