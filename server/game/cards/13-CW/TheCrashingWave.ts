import DrawCard from '../../DrawCard.js';
import { CardType, Location } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class TheCrashingWave extends DrawCard {
    static id = 'the-crashing-wave';

    setupCardAbilities() {
        this.reaction('Move the conflict')
            .when({
                onTheCrashingWave: (event, context) => event.conflict.defendingPlayer === context.player
            })
            .target({
                cardType: CardType.Province,
                location: Location.Provinces
            }, AbilityDsl.actions.moveConflict());
    }
}


export default TheCrashingWave;
