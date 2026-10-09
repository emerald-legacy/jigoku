import DrawCard from '../../DrawCard.js';
import { CardType, PlayType } from '../../Constants.js';
import type { AbilityContext } from '../../AbilityContext.js';

class Censure extends DrawCard {
    static id = 'censure';

    setupCardAbilities() {
        this.wouldInterrupt('Cancel an event')
            .when({
                onInitiateAbilityEffects: (event) => event.card.type === CardType.Event
            })
            .cancel()
            .cannotBeMirrored();
    }

    canPlay(context: AbilityContext, playType?: PlayType): boolean {
        if(context.player.imperialFavor !== '') {
            return super.canPlay(context, playType);
        }
        return false;
    }
}


export default Censure;
