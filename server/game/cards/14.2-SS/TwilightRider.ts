import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class TwilightRider extends DrawCard {
    static id = 'twilight-rider';

    setupCardAbilities() {
        this.reaction('Ready a character')
            .when({
                onMoveToConflict: (event, context) => event.card === context.source
            })
            .target('target', {
                cardType: CardType.Character
            }, AbilityDsl.actions.ready());
    }
}


export default TwilightRider;
