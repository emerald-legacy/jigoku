import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import { Location } from '../../../Constants.js';

class MatsuSakura extends DrawCard {
    static id = 'matsu-sakura';

    setupCardAbilities() {
        this.wouldInterrupt('Cancel conflict province ability')
            .when({
                onInitiateAbilityEffects: (event, context) => context.source.isAttacking() && event.card.isConflictProvince() && event.card.controller &&
                    (event.card.controller.getDynastyCardsInProvince(event.card.location).some(a => a.isFaceup()) || //any faceup cards
                        event.card.location === Location.StrongholdProvince)
            })
            .gameAction(AbilityDsl.actions.cancel())
            .effect('cancel the effects of {1}\'s ability', context => context.event.card);
    }
}


export default MatsuSakura;
