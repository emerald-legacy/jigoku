import DrawCard from '../../DrawCard.js';
import { isOpponentsRingOrCardEffect } from '../effectSource.js';

class AkodoMotivator extends DrawCard {
    static id = 'akodo-motivator';

    setupCardAbilities() {
        this.reaction('Opponent discards an equal number of cards at random')
            .when({
                onCardsDiscardedFromHand: (event, context) =>
                    event.player === context.player &&
                    (event.discardedCards?.length ?? 0) > 0 &&
                    isOpponentsRingOrCardEffect(event.player, event.context)
            })
            .discardAtRandom((context) => ({
                amount: context.event.discardedCards?.length ?? 0
            }));
    }
}


export default AkodoMotivator;
