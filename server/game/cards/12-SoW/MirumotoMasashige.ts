import DrawCard from '../../DrawCard.js';
import { Players, Phases } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class MirumotoMasashige extends DrawCard {
    static id = 'mirumoto-masashige';

    setupCardAbilities() {
        this.reaction('Honor a character')
            .when({
                onPhaseStarted: (event, context) => event.phase === Phases.Conflict && context.player.opponent &&
                                                    context.player.cardsInPlay.length < context.player.opponent.cardsInPlay.length
            })
            .target('target', {
                activePromptTitle: 'Choose a character to honor',
                controller: Players.Self
            }, AbilityDsl.actions.honor());
    }
}


export default MirumotoMasashige;
