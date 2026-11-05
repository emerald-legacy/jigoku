import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';

class VoiceOfHonor extends DrawCard {
    static id = 'voice-of-honor';

    override setupCardAbilities() {
        this.wouldInterrupt('Cancel an event')
            .when({
                onInitiateAbilityEffects: (event, context) => event.card.type === CardType.Event && context.player.opponent &&
                                                            context.player.inPlay({ attachments: true }).filter((card) => card.isHonored).length >
                                                            context.player.opponent.inPlay({ attachments: true }).filter((card) => card.isHonored).length
            })
            .cancel()
            .cannotBeMirrored();
    }
}


export default VoiceOfHonor;

