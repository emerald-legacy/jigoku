import DrawCard from '../../drawcard.js';
import { Players, Phases } from '../../Constants.js';

class SecludedTemple extends DrawCard {
    static id = 'secluded-temple';

    setupCardAbilities(ability) {
        this.reaction({
            title: 'Remove a fate from opponent\'s characters',
            when: {
                onPhaseStarted: (event, context) => event.phase === Phases.Conflict && context.player.opponent &&
                                                    context.player.cardsInPlay.length < context.player.opponent.cardsInPlay.length
            },
            target: {
                player: Players.Opponent,
                activePromptTitle: 'Choose a character to remove a fate from',
                controller: Players.Opponent,
                gameAction: ability.actions.removeFate()
            }
        });
    }
}


export default SecludedTemple;
