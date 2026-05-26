import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Durations } from '../../Constants.js';

class NitenPupil extends DrawCard {
    static id = 'niten-pupil';

    setupCardAbilities() {
        this.reaction({
            title: 'Double base skills',
            when: {
                onHonorDialsRevealed: (event: any, context) => event.duel && event.duel.isInvolved(context.source)
            },
            gameAction: AbilityDsl.actions.cardLastingEffect({
                effect: [
                    AbilityDsl.effects.modifyBaseMilitarySkillMultiplier(2),
                    AbilityDsl.effects.modifyBasePoliticalSkillMultiplier(2)
                ],
                duration: Durations.UntilEndOfPhase
            }),
            effect: 'double {0}\'s base {1} and {2} skills',
            effectArgs: ['military', 'political']
        });
    }
}


export default NitenPupil;
