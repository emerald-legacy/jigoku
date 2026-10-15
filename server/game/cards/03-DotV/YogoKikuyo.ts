import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { Location, CardType, Trait } from '../../Constants.js';

class YogoKikuyo extends DrawCard {
    static id = 'yogo-kikuyo';

    setupCardAbilities() {
        this.wouldInterrupt('Cancel a spell')
            .when({
                onInitiateAbilityEffects: (event, context) =>
                    this.game.isDuringConflict() && event.card.type === CardType.Event &&
                    event.card.hasTrait(Trait.Spell) && event.card.controller === context.player.opponent
            })
            .location(Location.Hand)
            .cost(costs.putSelfIntoPlay())
            .cancel();
    }
}


export default YogoKikuyo;
