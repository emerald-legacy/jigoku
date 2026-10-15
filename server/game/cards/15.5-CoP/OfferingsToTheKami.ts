import { ConflictType, Players } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import { claimRing, multiple, resolveRingEffect } from '../../GameActions/GameActions.js';

export default class OfferingsToTheKami extends ProvinceCard {
    static id = 'offerings-to-the-kami';

    setupCardAbilities() {
        this.reaction('Resolve the ring as if you were the attacker')
            .when({
                onCardRevealed: (event, context) => event.card === context.source
            })
            .ringTarget({
                activePromptTitle: 'Choose a ring to claim and resolve',
                player: Players.Self,
                ringCondition: (ring) => ring.isUnclaimed()
            }, multiple([
                resolveRingEffect((context) => ({ player: context.player })),
                claimRing({ takeFate: true, type: ConflictType.Political })
            ]));
    }
}
