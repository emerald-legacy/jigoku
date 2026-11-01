import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { delayedEffect } from '../../effects.js';
import { removeFromGame } from '../../GameActions/GameActions.js';
import {CardType, Duration, Location} from '../../Constants.js';

class ChampionsOfYomi extends DrawCard {
    static id = 'champions-of-yomi';

    override setupCardAbilities() {
        this.reaction('Put into play')
            .when({
                afterConflict: (event, context) =>
                    // a character you control on the losing attacking side, whoever is the attacking player
                    event.conflict.loser === event.conflict.attackingPlayer &&
                    event.conflict.getAttackers().some((card) => card.controller === context.player)
            })
            .location(Location.DynastyDiscardPile)
            .cost(costs.bow({
                cardType: CardType.Stronghold
            }))
            .putIntoPlay()
            .chatText('put {0} into play and remove {0} from the game at the end of the phase')
            .then()
            .cardLastingEffect((context) => ({
                target: context.source,
                duration: Duration.UntilEndOfRound,
                effect: delayedEffect({
                    when: {
                        onPhaseEnded: () => context.source.location === Location.PlayArea
                    },
                    message: (context) => msg`${context.source} is removed from the game due to its delayed effect`,
                    gameAction: removeFromGame()
                })
            }));
    }
}


export default ChampionsOfYomi;
