import DrawCard from '../../drawcard.js';
import { CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class TwilightRider extends DrawCard {
    static id = 'twilight-rider';

    setupCardAbilities() {
        this.reaction({
            title: 'Ready a character',
            when: {
                onMoveToConflict: (event, context) => event.card === context.source
            },
            target: {
                cardType: CardTypes.Character,
                gameAction: AbilityDsl.actions.ready()
            }
        });
    }
}


export default TwilightRider;
