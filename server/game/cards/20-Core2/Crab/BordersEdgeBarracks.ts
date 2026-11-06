import { CardType, Players } from '../../../Constants.js';
import { perConflict } from '../../../AbilityLimit.js';
import { moveToConflict } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class BordersEdgeBarracks extends DrawCard {
    static id = 'border-s-edge-barracks';

    override setupCardAbilities() {
        this.conflictAction('Move a character to the conflict')
            .condition((context) => context.player.isDefendingPlayer())
            .target({
                cardType: CardType.Character,
                controller: Players.Self
            }, moveToConflict())
            .limit(perConflict(1));
    }
}
