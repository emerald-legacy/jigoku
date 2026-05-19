import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardTypes } from '../../Constants.js';

class Censure extends DrawCard {
    static id = 'censure';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Cancel an event',
            when: {
                onInitiateAbilityEffects: event => event.card.type === CardTypes.Event
            },
            cannotBeMirrored: true,
            gameAction: AbilityDsl.actions.cancel()
        });
    }

    canPlay(context, playType) {
        if(context.player.imperialFavor !== '') {
            return super.canPlay(context, playType);
        }
        return false;
    }
}


export default Censure;
