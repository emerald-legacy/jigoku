import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { unlimitedPerConflict } from '../../AbilityLimit.js';
import { delayedEffect } from '../../effects.js';
import { discardFromPlay } from '../../GameActions/GameActions.js';

class DojiHotaru2 extends DrawCard {
    static id = 'doji-hotaru-2';

    setupCardAbilities() {
        this.persistentEffect({
            effect: delayedEffect({
                condition: (context) => !!context.player.cardsInPlay.find((card) => card.name === 'Doji Kuwanan'),
                message: (context) => msg`${context.player.cardsInPlay.find((card) => card.name === 'Doji Kuwanan')} is discarded from play as its controller controls ${context.source}`,
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
            .gainHonor()
            .chatText('gain 1 honor')
            .limit(unlimitedPerConflict());
    }
}


export default DojiHotaru2;
