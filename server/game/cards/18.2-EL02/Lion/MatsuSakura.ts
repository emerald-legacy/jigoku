import DrawCard from '../../../drawcard.js';
import AbilityDsl from '../../../abilitydsl.js';
import { Locations } from '../../../Constants.js';

class MatsuSakura extends DrawCard {
    static id = 'matsu-sakura';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Cancel conflict province ability',
            when: {
                onInitiateAbilityEffects: (event, context) => context.source.isAttacking() && event.card.isConflictProvince() && event.card.controller &&
                    (event.card.controller.getDynastyCardsInProvince(event.card.location).some(a => a.isFaceup()) || //any faceup cards
                        event.card.location === Locations.StrongholdProvince)
            },
            effect: 'cancel the effects of {1}\'s ability',
            effectArgs: context => context.event.card,
            gameAction: AbilityDsl.actions.cancel()
        });
    }
}


export default MatsuSakura;
