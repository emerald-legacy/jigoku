import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { unlimited } from '../../AbilityLimit.js';
import { delayedEffect } from '../../effects.js';
import { discardFromPlay } from '../../GameActions/GameActions.js';
import type { AbilityContext } from '../../AbilityContext.js';

function kuwanan(context: AbilityContext) {
    return context.player.cardsInPlay.find((card) => card.name === 'Doji Kuwanan');
}

class DojiHotaru2 extends DrawCard {
    static id = 'doji-hotaru-2';

    override setupCardAbilities() {
        this.persistentEffect({
            effect: delayedEffect({
                condition: (context) => !!kuwanan(context),
                message: (context) => msg`${kuwanan(context)} is discarded from play as its controller controls ${context.source}`,
                gameAction: discardFromPlay((context) => ({
                    target: kuwanan(context)
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
            .limit(unlimited());
    }
}


export default DojiHotaru2;
