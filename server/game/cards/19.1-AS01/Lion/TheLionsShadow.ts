import { addKeyword, honorStatusDoesNotModifySkill } from '../../../effects.js';
import { Phases } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class TheLionsShadow extends DrawCard {
    static id = 'the-lion-s-shadow';

    public setupCardAbilities() {
        this.attachmentConditions({
            limitTrait: { title: 1 },
            trait: ['courtier', 'scout']
        });

        this.persistentEffect({
            condition: (context) => context.game.currentPhase === Phases.Fate,
            effect: addKeyword('ancestral')
        });

        this.whileAttached({
            condition: (context) => !!context.source.parentCharacter?.isDishonored,
            effect: honorStatusDoesNotModifySkill()
        });

        this.whileAttached({
            condition: (context) =>
                !!context.source.parentCharacter?.isAttacking() &&
                context.game.currentConflict?.getNumberOfParticipantsFor('attacker') === 1,
            effect: addKeyword('covert')
        });
    }
}
