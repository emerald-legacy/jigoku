import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, Duration } from '../../Constants.js';

class StudentOfAnatomies extends DrawCard {
    static id = 'student-of-anatomies';

    setupCardAbilities() {
        this.action('Sacrifice a character to blank an enemy')
            .cost(AbilityDsl.costs.sacrifice({
                cardType: CardType.Character
            }))
            .target('target', {
                cardType: CardType.Character
            }, AbilityDsl.actions.cardLastingEffect({
                duration: Duration.UntilEndOfPhase,
                effect: AbilityDsl.effects.blank()
            }))
            .effect('treat {1} as if its printed text box were blank until the end of the phase', (context) => context.target ?? '');
    }
}


export default StudentOfAnatomies;
