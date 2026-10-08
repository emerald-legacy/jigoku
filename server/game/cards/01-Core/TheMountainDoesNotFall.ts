import DrawCard from '../../DrawCard.js';
import { Duration, CardType } from '../../Constants.js';
import { perRound } from '../../AbilityLimit.js';
import { doesNotBow } from '../../effects.js';
import { cardLastingEffect } from '../../GameActions/GameActions.js';

class TheMountainDoesNotFall extends DrawCard {
    static id = 'the-mountain-does-not-fall';

    setupCardAbilities() {
        this.action('Choose a character to not bow when defending')
            .target({
                cardType: CardType.Character
            }, cardLastingEffect((context) => ({
                duration: Duration.UntilEndOfPhase,
                condition: () => context.target.isDefending(),
                effect: doesNotBow()
            })))
            .chatText('make {0} not bow as a defender')
            .max(perRound(1));
    }
}


export default TheMountainDoesNotFall;
