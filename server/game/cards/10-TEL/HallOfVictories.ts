import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class HallOfVictories extends DrawCard {
    static id = 'hall-of-victories';

    setupCardAbilities() {
        this.forcedReaction('Gain an honor')
            .when({
                afterConflict: (event) => !!event.conflict.winner
            })
            .gameAction(AbilityDsl.actions.gainHonor(context => ({
                target: context.game.currentConflict?.winner ?? undefined
            })))
            .effect('make {1} gain 1 honor', context => [context.game.currentConflict?.winner?.name ?? ''])
            .limit(AbilityDsl.limit.unlimitedPerConflict());
    }
}


export default HallOfVictories;
