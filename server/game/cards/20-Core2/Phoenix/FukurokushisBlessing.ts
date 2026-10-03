import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import { ProvinceCard } from '../../../ProvinceCard.js';

export default class FukurokushisBlessing extends DrawCard {
    static id = 'fukurokushi-s-blessing';

    setupCardAbilities() {
        this.wouldInterrupt('Cancel conflict province ability')
            .when({
                onInitiateAbilityEffects: ({ card }) => card instanceof ProvinceCard
            })
            .gameAction(AbilityDsl.actions.cancel())
            .effect('cancel the effects of {1}\'s ability', (context) => context.event.card ?? '')
            .max(AbilityDsl.limit.perRound(1));
    }
}
