import { perConflict } from '../../../AbilityLimit.js';
import DrawCard from '../../../DrawCard.js';
import { ConflictType, Trait } from '../../../Constants.js';

export default class ForGreaterGlory extends DrawCard {
    static id = 'for-greater-glory';

    override setupCardAbilities() {
        this.reaction('Put a fate on all your bushi in this conflict')
            .when({
                onBreakProvince: (event, context) =>
                    this.game.isDuringConflict(ConflictType.Military) && event.breaker === context.player
            })
            .placeFate((context) => ({
                target: context.event.conflict
                    ?.getCharacters(context.player)
                    .filter((card) => card.hasTrait(Trait.Bushi)) ?? []
            }))
            .max(perConflict(1));
    }
}
