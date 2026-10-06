import { CardType, Players, ConflictType } from '../../Constants.js';
import { StrongholdCard } from '../../StrongholdCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { moveToConflict } from '../../GameActions/GameActions.js';

export default class GoldenPlainsOutpost extends StrongholdCard {
    static id = 'golden-plains-outpost';

    setupCardAbilities() {
        this.action('Move a cavalry character to the conflict')
            .cost(AbilityDsl.costs.bowSelf())
            .condition(() => this.game.isDuringConflict(ConflictType.Military))
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.hasTrait('cavalry')
            }, moveToConflict());
    }
}
