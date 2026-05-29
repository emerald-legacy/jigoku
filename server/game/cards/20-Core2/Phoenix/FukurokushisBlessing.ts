import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import { ProvinceCard } from '../../../ProvinceCard.js';

export default class FukurokushisBlessing extends DrawCard {
    static id = 'fukurokushi-s-blessing';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Cancel conflict province ability',
            when: {
                onInitiateAbilityEffects: ({ card }) => card instanceof ProvinceCard
            },
            effect: 'cancel the effects of {1}\'s ability',
            effectArgs: (context) => context.event.card,
            gameAction: AbilityDsl.actions.cancel(),
            max: AbilityDsl.limit.perRound(1)
        });
    }
}
