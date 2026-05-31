import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class GregariousWard extends DrawCard {
    static id = 'gregarious-ward';

    public setupCardAbilities() {
        this.reaction({
            title: 'Gain fate',
            when: {
                afterConflict: (event, context) =>
                    event.conflict.winner === context.source.controller &&
                    context.source.isParticipating() &&
                    (context.game.currentConflict?.hasMoreParticipants(context.player, () => true) ?? false)
            },
            gameAction: AbilityDsl.actions.placeFate(),
            max: AbilityDsl.limit.perConflict(1)
        });
    }
}
