import { msg } from '../../../GameChat.js';
import DrawCard from '../../../DrawCard.js';
import { Location } from '../../../Constants.js';

class MatsuSakura extends DrawCard {
    static id = 'matsu-sakura';

    setupCardAbilities() {
        this.wouldInterrupt('Cancel conflict province ability')
            .when({
                onInitiateAbilityEffects: (event, context) => context.source.isAttacking() && event.card.isConflictProvince() && event.card.controller &&
                    (event.card.controller.getDynastyCardsInProvince(event.card.location).some((a) => a.isFaceup()) || //any faceup cards
                        event.card.location === Location.StrongholdProvince)
            })
            .cancel()
            .chatText((context) => msg`cancel the effects of ${context.event.card}'s ability`);
    }
}


export default MatsuSakura;
