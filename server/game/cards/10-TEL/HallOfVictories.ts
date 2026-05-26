import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';

class HallOfVictories extends DrawCard {
    static id = 'hall-of-victories';

    setupCardAbilities() {
        this.forcedReaction({
            title: 'Gain an honor',
            when: {
                afterConflict: (event) => !!event.conflict.winner
            },
            limit: AbilityDsl.limit.unlimitedPerConflict(),
            gameAction: AbilityDsl.actions.gainHonor(context => ({
                target: context.game.currentConflict?.winner ?? undefined
            })),
            effect: 'make {1} gain 1 honor',
            effectArgs: context => [context.game.currentConflict?.winner?.name ?? '']
        });
    }
}


export default HallOfVictories;
