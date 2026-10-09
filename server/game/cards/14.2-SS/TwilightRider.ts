import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import { ready } from '../../GameActions/GameActions.js';

class TwilightRider extends DrawCard {
    static id = 'twilight-rider';

    setupCardAbilities() {
        this.reaction('Ready a character')
            .when({
                onMoveToConflict: (event, context) => event.card === context.source
            })
            .target({
                cardType: CardType.Character
            }, ready());
    }
}


export default TwilightRider;
