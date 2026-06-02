import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Location, CardType } from '../../Constants.js';

class YogoKikuyo extends DrawCard {
    static id = 'yogo-kikuyo';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Cancel a spell',
            when: {
                onInitiateAbilityEffects: (event, context) =>
                    this.game.isDuringConflict() && event.card.type === CardType.Event &&
                    event.card.hasTrait('spell') && event.card.controller === context.player.opponent
            },
            cost: AbilityDsl.costs.putSelfIntoPlay(),
            location: Location.Hand,
            gameAction: AbilityDsl.actions.cancel()
        });
    }
}


export default YogoKikuyo;
