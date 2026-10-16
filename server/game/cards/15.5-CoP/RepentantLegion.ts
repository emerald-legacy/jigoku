import DrawCard from '../../DrawCard.js';
import { fillProvince, sequential } from '../../GameActions/GameActions.js';

class RepentantLegion extends DrawCard {
    static id = 'repentant-legion';

    override setupCardAbilities() {
        this.reaction('fill provinces with a card')
            .when({
                // RRG: a province broken outside conflict resolution is broken by its controller's opponent
                onBreakProvince: (event, context) => context.source.isParticipating() && event.card.controller !== context.player
            })
            .gameAction(sequential((context) =>
                context.game.getProvinceArray(false).map((location) => fillProvince({ location, amount: 1 }))
            ))
            .chatText('put 1 card into each of their non-stronghold provinces');
    }
}


export default RepentantLegion;
