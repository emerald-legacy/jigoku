import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../drawcard.js';

class CurryFavor extends DrawCard {
    static id = 'curry-favor';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction({
            title: 'Ready a character',
            when: {
                onReturnHome: (event: any, context) => {
                    if(this.game.getConflicts(context.player).filter(conflict => !conflict.passed).length !== 2) {
                        return false;
                    }
                    return !!event.conflict && event.conflict.attackingPlayer === context.player && event.card.controller === context.player && !!event.bowEvent && !event.bowEvent.cancelled;
                }
            },
            cannotBeMirrored: true,
            gameAction: ability.actions.ready((context: any) => ({ target: context.event.card }))
        });
    }
}


export default CurryFavor;
