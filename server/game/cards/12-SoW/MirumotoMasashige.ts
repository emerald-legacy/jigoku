import DrawCard from '../../DrawCard.js';
import { Players, Phase } from '../../Constants.js';
import { honor } from '../../GameActions/GameActions.js';

class MirumotoMasashige extends DrawCard {
    static id = 'mirumoto-masashige';

    setupCardAbilities() {
        this.reaction('Honor a character')
            .when({
                onPhaseStarted: (event, context) => event.phase === Phase.Conflict && context.player.opponent &&
                                                    context.player.cardsInPlay.length < context.player.opponent.cardsInPlay.length
            })
            .target({
                activePromptTitle: 'Choose a character to honor',
                controller: Players.Self
            }, honor());
    }
}


export default MirumotoMasashige;
