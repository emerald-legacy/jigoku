import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class ShinjoHaruko extends DrawCard {
    static id = 'shinjo-haruko';

    setupCardAbilities() {
        this.action({
            title: 'Move a honored character into the conflict',
            condition: context => context.source.isParticipating(),
            target: {
                cardType: CardType.Character,
                controller: Players.Any,
                cardCondition: card => card.isHonored,
                gameAction: AbilityDsl.actions.moveToConflict()
            }
        });
    }
}

export default ShinjoHaruko;

