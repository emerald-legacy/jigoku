import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, Duration } from '../../Constants.js';

class StudentOfAnatomies extends DrawCard {
    static id = 'student-of-anatomies';

    setupCardAbilities() {
        this.action<DrawCard>({
            title: 'Sacrifice a character to blank an enemy',
            cost: AbilityDsl.costs.sacrifice({
                cardType: CardType.Character
            }),
            target: {
                cardType: CardType.Character,
                gameAction: AbilityDsl.actions.cardLastingEffect({
                    duration: Duration.UntilEndOfPhase,
                    effect: AbilityDsl.effects.blank()
                })
            },
            effect: 'treat {1} as if its printed text box were blank until the end of the phase',
            effectArgs: (context) => context.target ?? ''
        });
    }
}


export default StudentOfAnatomies;
