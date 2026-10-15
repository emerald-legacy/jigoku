import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';

class Forgery extends DrawCard {
    static id = 'forgery';

    override setupCardAbilities() {
        this.wouldInterrupt('Cancel an event')
            .when({
                onInitiateAbilityEffects: (event, context) => event.card.type === CardType.Event &&
                    event.context.player === context.player.opponent && context.player.isLessHonorable()
            })
            .cancel()
            .cannotBeMirrored();
    }
}


export default Forgery;
