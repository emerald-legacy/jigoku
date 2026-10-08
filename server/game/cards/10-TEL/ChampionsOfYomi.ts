import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { delayedEffect } from '../../effects.js';
import { cardLastingEffect, putIntoPlay, removeFromGame, sequential } from '../../GameActions/GameActions.js';
import {CardType, Duration, Location} from '../../Constants.js';

class ChampionsOfYomi extends DrawCard {
    static id = 'champions-of-yomi';

    setupCardAbilities() {
        this.reaction('Put into play')
            .when({
                afterConflict: (event, context) => event.conflict.loser === context.player
                    && event.conflict.defendingPlayer !== context.player
                    && event.conflict.getAttackers().length !== 0
            })
            .cost(costs.bow({
                cardType: CardType.Stronghold
            }))
            .gameAction(sequential([
                putIntoPlay(context => ({
                    target: context.source
                })),
                cardLastingEffect(context => ({
                    target: context.source,
                    duration: Duration.UntilEndOfRound,
                    effect: delayedEffect({
                        when: {
                            onPhaseEnded: () => true
                        },
                        message: '{0} is removed from the game due to its delayed effect',
                        messageArgs: (context) => [context.source],
                        gameAction: removeFromGame()
                    })
                }))
            ]))
            .chatText('put {0} into play and remove {0} from the game at the end of the phase')
            .location(Location.DynastyDiscardPile);
    }
}


export default ChampionsOfYomi;
