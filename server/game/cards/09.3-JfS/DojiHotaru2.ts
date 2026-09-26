import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';

class DojiHotaru2 extends DrawCard {
    static id = 'doji-hotaru-2';

    setupCardAbilities() {
        this.persistentEffect({
            effect: AbilityDsl.effects.delayedEffect({
                condition: (context: AbilityContext) => context.player && !!context.player.cardsInPlay.find((card) => card.name === 'Doji Kuwanan'),
                message: '{1} is discarded from play as its controller controls {0}',
                messageArgs: (context: AbilityContext) => [context.source, context.player.cardsInPlay.find((card) => card.name === 'Doji Kuwanan')],
                gameAction: AbilityDsl.actions.discardFromPlay((context: AbilityContext) => ({
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
            .gameAction(AbilityDsl.actions.gainHonor())
            .effect('gain 1 honor')
            .limit(AbilityDsl.limit.unlimitedPerConflict());
    }
}


export default DojiHotaru2;
