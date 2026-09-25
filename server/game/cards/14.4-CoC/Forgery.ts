import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType } from '../../Constants.js';

class Forgery extends DrawCard {
    static id = 'forgery';

    setupCardAbilities() {
        this.wouldInterrupt('Cancel an event')
            .when({
                onInitiateAbilityEffects: (event, context) => event.card.type === CardType.Event && context.player.opponent &&
                    context.player.isLessHonorable()
            })
            .gameAction(AbilityDsl.actions.cancel())
            .cannotBeMirrored();
    }
}


export default Forgery;
