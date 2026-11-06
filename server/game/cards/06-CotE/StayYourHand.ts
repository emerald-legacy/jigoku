import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';

class StayYourHand extends DrawCard {
    static id = 'stay-your-hand';

    override setupCardAbilities() {
        this.wouldInterrupt('Cancel a duel')
            .when({
                onDuelInitiated: (event, context) =>
                    // errata: any duel that targets a character you control, not only an opponent's
                    !!event.context &&
                    Object.values(event.context.targets).flat().some((card) => card?.controller === context.player)
            })
            .cancel()
            .chatText((context) => msg`cancel the duel originating from ${context.event.context.source}`)
            .cannotBeMirrored();
    }
}


export default StayYourHand;
