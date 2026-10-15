import { msg } from '../../../GameChat.js';
import { perRound } from '../../../AbilityLimit.js';
import DrawCard from '../../../DrawCard.js';
import { ProvinceCard } from '../../../ProvinceCard.js';

export default class FukurokushisBlessing extends DrawCard {
    static id = 'fukurokushi-s-blessing';

    setupCardAbilities() {
        this.wouldInterrupt('Cancel conflict province ability')
            .when({
                onInitiateAbilityEffects: ({ card }) => card instanceof ProvinceCard
            })
            .cancel()
            .chatText((context) => msg`cancel the effects of ${context.event.card}'s ability`)
            .max(perRound(1));
    }
}
