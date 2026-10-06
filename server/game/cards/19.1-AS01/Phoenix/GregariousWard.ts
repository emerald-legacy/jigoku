import AbilityDsl from '../../../abilitydsl.js';
import { placeFate } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class GregariousWard extends DrawCard {
    static id = 'gregarious-ward';

    public setupCardAbilities() {
        this.reaction('Gain fate')
            .when({
                afterConflict: (event, context) =>
                    event.conflict.winner === context.source.controller &&
                    context.source.isParticipating() &&
                    event.conflict.hasMoreParticipants(context.player)
            })
            .gameAction(placeFate())
            .max(AbilityDsl.limit.perConflict(1));
    }
}
