import DrawCard from '../../DrawCard.js';
import { Players, Phases } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class MirumotoMasashige extends DrawCard {
    static id = 'mirumoto-masashige';

    setupCardAbilities() {
        this.reaction({
            title: 'Honor a character',
            when: {
                onPhaseStarted: (event, context) => event.phase === Phases.Conflict && context.player.opponent &&
                                                    context.player.cardsInPlay.length < context.player.opponent.cardsInPlay.length
            },
            target: {
                activePromptTitle: 'Choose a character to honor',
                controller: Players.Self,
                gameAction: AbilityDsl.actions.honor()
            }
        });
    }
}


export default MirumotoMasashige;
