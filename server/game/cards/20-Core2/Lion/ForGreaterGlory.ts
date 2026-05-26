import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../drawcard.js';

export default class ForGreaterGlory extends DrawCard {
    static id = 'for-greater-glory';

    setupCardAbilities() {
        this.reaction({
            title: 'Put a fate on all your bushi in this conflict',
            when: {
                onBreakProvince: (event, context) =>
                    this.game.isDuringConflict('military') && event.conflict?.attackingPlayer === context.player
            },
            gameAction: AbilityDsl.actions.placeFate((context) => ({
                target: (context as any).event.conflict
                    .getCharacters(context.player)
                    .filter((card: any) => card.hasTrait('bushi'))
            })),
            max: AbilityDsl.limit.perConflict(1)
        });
    }
}
