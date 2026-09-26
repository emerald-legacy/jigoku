import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType } from '../../Constants.js';
import { AbilityContext } from '../../AbilityContext.js';

class Censure extends DrawCard {
    static id = 'censure';

    setupCardAbilities() {
        this.wouldInterrupt('Cancel an event')
            .when({
                onInitiateAbilityEffects: event => event.card.type === CardType.Event
            })
            .gameAction(AbilityDsl.actions.cancel())
            .cannotBeMirrored();
    }

    canPlay(context: AbilityContext, playType: string = 'play'): boolean {
        if(context.player.imperialFavor !== '') {
            return super.canPlay(context, playType);
        }
        return false;
    }
}


export default Censure;
