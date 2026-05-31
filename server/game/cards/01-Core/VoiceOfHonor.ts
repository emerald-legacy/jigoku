import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardTypes } from '../../Constants.js';

class VoiceOfHonor extends DrawCard {
    static id = 'voice-of-honor';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Cancel an event',
            when: {
                onInitiateAbilityEffects: (event, context) => event.card.type === CardTypes.Event && context.player.opponent &&
                                                            context.player.getNumberOfCardsInPlay(card => card.isHonored) >
                                                            context.player.opponent.getNumberOfCardsInPlay(card => card.isHonored)
            },
            cannotBeMirrored: true,
            gameAction: AbilityDsl.actions.cancel()
        });
    }
}


export default VoiceOfHonor;

