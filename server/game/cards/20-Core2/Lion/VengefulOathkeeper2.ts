import { Location } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class VengefulOathkeeper2 extends DrawCard {
    static id = 'vengeful-oathkeeper-2';

    override setupCardAbilities() {
        this.reaction('Put this into play')
            .when({
                afterConflict: (event, context) =>
                    event.conflict.attackingPlayer === context.player.opponent &&
                    event.conflict.winner === context.player.opponent
            })
            .location(Location.Hand)
            .putIntoPlay();
    }
}
