import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';

class VoiceOfHonor extends DrawCard {
    static id = 'voice-of-honor';

    setupCardAbilities() {
        this.wouldInterrupt('Cancel an event')
            .when({
                onInitiateAbilityEffects: (event, context) => event.card.type === CardType.Event && context.player.opponent &&
                                                            context.player.getNumberOfCardsInPlay((card) => card.isHonored) >
                                                            context.player.opponent.getNumberOfCardsInPlay((card) => card.isHonored)
            })
            .cancel()
            .cannotBeMirrored();
    }
}


export default VoiceOfHonor;

