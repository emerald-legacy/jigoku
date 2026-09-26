import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Location, CardType } from '../../Constants.js';

class YogoKikuyo extends DrawCard {
    static id = 'yogo-kikuyo';

    setupCardAbilities() {
        this.wouldInterrupt('Cancel a spell')
            .when({
                onInitiateAbilityEffects: (event, context) =>
                    this.game.isDuringConflict() && event.card.type === CardType.Event &&
                    event.card.hasTrait('spell') && event.card.controller === context.player.opponent
            })
            .cost(AbilityDsl.costs.putSelfIntoPlay())
            .gameAction(AbilityDsl.actions.cancel())
            .location(Location.Hand);
    }
}


export default YogoKikuyo;
