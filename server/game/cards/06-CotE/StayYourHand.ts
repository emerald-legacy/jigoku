import DrawCard from '../../DrawCard.js';
import { cancel } from '../../GameActions/GameActions.js';

class StayYourHand extends DrawCard {
    static id = 'stay-your-hand';

    setupCardAbilities() {
        this.wouldInterrupt('Cancel a duel')
            .when({
                onDuelInitiated: (event, context) =>
                    !!event.context &&
                    event.context.player === context.player.opponent &&
                    (Object.values(event.context.targets).some((card) => !Array.isArray(card) && card.controller === context.player) ||
                    (event.context.targets.target && Object.values(event.context.targets.target).some((card) => card.controller === context.player)))
            })
            .gameAction(cancel())
            .effect('cancel the duel originating from {1}', (context) => context.event.context.source)
            .cannotBeMirrored();
    }
}


export default StayYourHand;
