import DrawCard from '../../DrawCard.js';
import { unlimitedPerConflict } from '../../AbilityLimit.js';
import { delayedEffect } from '../../effects.js';
import { discardFromPlay, gainHonor } from '../../GameActions/GameActions.js';

class DojiHotaru2 extends DrawCard {
    static id = 'doji-hotaru-2';

    setupCardAbilities() {
        this.persistentEffect({
            effect: delayedEffect({
                condition: (context) => !!context.player.cardsInPlay.find((card) => card.name === 'Doji Kuwanan'),
                message: '{1} is discarded from play as its controller controls {0}',
                messageArgs: (context) => [context.source, context.player.cardsInPlay.find((card) => card.name === 'Doji Kuwanan')],
                gameAction: discardFromPlay((context) => ({
                    target: context.player.cardsInPlay.find((card) => card.name === 'Doji Kuwanan')
                }))
            })
        });
        this.reaction('Gain 1 honor')
            .when({
                onCardPlayed: (event, context) => {
                    return context.source.isParticipating() &&
                        event.player === context.player.opponent;
                }
            })
            .gameAction(gainHonor())
            .effect('gain 1 honor')
            .limit(unlimitedPerConflict());
    }
}


export default DojiHotaru2;
