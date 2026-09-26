import DrawCard from '../../DrawCard.js';
import { Players, Phases } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class SecludedTemple extends DrawCard {
    static id = 'secluded-temple';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction('Remove a fate from opponent\'s characters')
            .when({
                onPhaseStarted: (event, context) => event.phase === Phases.Conflict && context.player.opponent &&
                                                    context.player.cardsInPlay.length < context.player.opponent.cardsInPlay.length
            })
            .target('target', {
                player: Players.Opponent,
                activePromptTitle: 'Choose a character to remove a fate from',
                controller: Players.Opponent
            }, ability.actions.removeFate());
    }
}


export default SecludedTemple;
