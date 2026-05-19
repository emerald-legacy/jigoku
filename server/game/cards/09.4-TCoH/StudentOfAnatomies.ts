import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardTypes, Durations } from '../../Constants.js';

class StudentOfAnatomies extends DrawCard {
    static id = 'student-of-anatomies';

    setupCardAbilities() {
        this.action({
            title: 'Sacrifice a character to blank an enemy',
            cost: AbilityDsl.costs.sacrifice({
                cardType: CardTypes.Character
            }),
            target: {
                cardType: CardTypes.Character,
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    duration: Durations.UntilEndOfPhase,
                    effect: AbilityDsl.effects.blank()
                })
            },
            effect: 'treat {1} as if its printed text box were blank until the end of the phase',
            effectArgs: (context) => context.target
        });
    }
}


export default StudentOfAnatomies;
