import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import {CardType, Duration, Location} from '../../Constants.js';
import type { AbilityContext } from '../../AbilityContext.js';

class ChampionsOfYomi extends DrawCard {
    static id = 'champions-of-yomi';

    setupCardAbilities() {
        this.reaction('Put into play')
            .when({
                afterConflict: (event, context) => event.conflict.loser === context.player
                    && event.conflict.defendingPlayer !== context.player
                    && event.conflict.getAttackers() && event.conflict.getAttackers().length !== 0
            })
            .cost(AbilityDsl.costs.bow({
                cardType: CardType.Stronghold
            }))
            .gameAction(AbilityDsl.actions.sequential([
                AbilityDsl.actions.putIntoPlay(context => ({
                    target: context.source
                })),
                AbilityDsl.actions.cardLastingEffect(context => ({
                    target: context.source,
                    duration: Duration.UntilEndOfRound,
                    effect: AbilityDsl.effects.delayedEffect({
                        when: {
                            onPhaseEnded: () => true
                        },
                        message: '{0} is removed from the game due to its delayed effect',
                        messageArgs: (context: AbilityContext) => [context.source],
                        gameAction: AbilityDsl.actions.removeFromGame()
                    })
                }))
            ]))
            .effect('put {0} into play and remove {0} from the game at the end of the phase')
            .location(Location.DynastyDiscardPile);
    }
}


export default ChampionsOfYomi;
