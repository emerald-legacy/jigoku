import DrawCard from '../../DrawCard.js';
import { Players, Phase } from '../../Constants.js';
import { removeFate } from '../../GameActions/GameActions.js';

class SecludedTemple extends DrawCard {
    static id = 'secluded-temple';

    override setupCardAbilities() {
        this.reaction('Remove a fate from opponent\'s characters')
            .when({
                onPhaseStarted: (event, context) => event.phase === Phase.Conflict && context.player.opponent &&
                                                    context.player.charactersInPlay.length < context.player.opponent.charactersInPlay.length
            })
            .target({
                player: Players.Opponent,
                activePromptTitle: 'Choose a character to remove a fate from',
                controller: Players.Opponent
            }, removeFate());
    }
}


export default SecludedTemple;
