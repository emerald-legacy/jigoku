import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { blank } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';
import { CardType, Duration } from '../../Constants.js';

class StudentOfAnatomies extends DrawCard {
    static id = 'student-of-anatomies';

    setupCardAbilities() {
        this.action('Sacrifice a character to blank an enemy')
            .cost(costs.sacrifice({
                cardType: CardType.Character
            }))
            .target({
                cardType: CardType.Character
            }, cardLastingEffect({
                duration: Duration.UntilEndOfPhase,
                effect: blank()
            }))
            .chatText((context) => msg`treat ${context.target} as if its printed text box were blank until the end of the phase`);
    }
}


export default StudentOfAnatomies;
