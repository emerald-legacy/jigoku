import { CardType, Players, ConflictType } from '../../Constants.js';
import { StrongholdCard } from '../../StrongholdCard.js';
import * as costs from '../../costs/index.js';
import { moveToConflict } from '../../GameActions/GameActions.js';

export default class GoldenPlainsOutpost extends StrongholdCard {
    static id = 'golden-plains-outpost';

    setupCardAbilities() {
        this.action('Move a cavalry character to the conflict')
            .cost(costs.bowSelf())
            .condition(() => this.game.isDuringConflict(ConflictType.Military))
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.hasTrait('cavalry')
            }, moveToConflict());
    }
}
