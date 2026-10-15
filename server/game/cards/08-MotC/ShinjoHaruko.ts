import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import { moveToConflict } from '../../GameActions/GameActions.js';

class ShinjoHaruko extends DrawCard {
    static id = 'shinjo-haruko';

    setupCardAbilities() {
        this.action('Move a honored character into the conflict')
            .condition((context) => context.source.isParticipating())
            .target({
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: (card) => card.isHonored
            }, moveToConflict());
    }
}

export default ShinjoHaruko;

