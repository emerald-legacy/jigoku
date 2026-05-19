import DrawCard from '../../drawcard.js';
import { CardTypes, Locations } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class TheCrashingWave extends DrawCard {
    static id = 'the-crashing-wave';

    setupCardAbilities() {
        this.reaction({
            title: 'Move the conflict',
            when: {
                onTheCrashingWave: (event, context) => event.conflict.defendingPlayer === context.player
            },
            target: {
                cardType: CardTypes.Province,
                location: Locations.Provinces,
                gameAction: AbilityDsl.actions.moveConflict()
            }
        });
    }
}


export default TheCrashingWave;
