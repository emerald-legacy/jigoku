import DrawCard from '../../drawcard.js';

class CurryFavor extends DrawCard {
    static id = 'curry-favor';

    setupCardAbilities(ability) {
        this.reaction({
            title: 'Ready a character',
            when: {
                onReturnHome: (event, context) => {
                    if(this.game.getConflicts(context.player).filter(conflict => !conflict.passed).length !== 2) {
                        return false;
                    }
                    return event.conflict.attackingPlayer === context.player && event.card.controller === context.player && !event.bowEvent.cancelled;
                }
            },
            cannotBeMirrored: true,
            gameAction: ability.actions.ready(context => ({ target: context.event.card }))
        });
    }
}


export default CurryFavor;
