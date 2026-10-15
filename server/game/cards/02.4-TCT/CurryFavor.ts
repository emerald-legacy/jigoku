import DrawCard from '../../DrawCard.js';

class CurryFavor extends DrawCard {
    static id = 'curry-favor';

    override setupCardAbilities() {
        this.reaction('Ready a character')
            .when({
                onReturnHome: (event, context) => {
                    if(this.game.getDeclaredConflictCount(context.player) !== 2) {
                        return false;
                    }
                    return event.conflict.attackingPlayer === context.player && event.card.controller === context.player && !event.bowEvent.cancelled;
                }
            })
            .ready((context) => ({ target: context.event.card }))
            .cannotBeMirrored();
    }
}


export default CurryFavor;
