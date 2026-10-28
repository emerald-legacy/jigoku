import { msg } from '../../../GameChat.js';
import { perRound } from '../../../AbilityLimit.js';
import DrawCard from '../../../DrawCard.js';

export default class FukurokushisBlessing extends DrawCard {
    static id = 'fukurokushi-s-blessing';

    override setupCardAbilities() {
        this.wouldInterrupt('Cancel conflict province ability')
            .when({
                onInitiateAbilityEffects: ({ card }) => card.isProvinceCard()
            })
            .cancel()
            .chatText((context) => msg`cancel the effects of ${context.event.card}'s ability`)
            .max(perRound(1))
            .cannotBeMirrored();
    }
}
