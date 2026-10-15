import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';

class Censure extends DrawCard {
    static id = 'censure';

    override setupCardAbilities() {
        this.wouldInterrupt('Cancel an event')
            .when({
                onInitiateAbilityEffects: (event) => event.card.type === CardType.Event
            })
            .playOnlyIf((context) => context.player.imperialFavor !== '')
            .cancel()
            .cannotBeMirrored();
    }
}


export default Censure;
