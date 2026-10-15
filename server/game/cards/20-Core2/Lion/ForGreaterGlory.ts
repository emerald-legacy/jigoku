import { perConflict } from '../../../AbilityLimit.js';
import DrawCard from '../../../DrawCard.js';
import { ConflictType } from '../../../Constants.js';

export default class ForGreaterGlory extends DrawCard {
    static id = 'for-greater-glory';

    setupCardAbilities() {
        this.reaction('Put a fate on all your bushi in this conflict')
            .when({
                onBreakProvince: (event, context) =>
                    this.game.isDuringConflict(ConflictType.Military) && event.conflict?.attackingPlayer === context.player
            })
            .placeFate((context) => ({
                target: context.event.conflict
                    ?.getCharacters(context.player)
                    .filter((card) => card.hasTrait('bushi')) ?? []
            }))
            .max(perConflict(1));
    }
}
