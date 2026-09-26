import { Players } from '../../Constants.js';
import { ProvinceCard } from '../../ProvinceCard.js';
import AbilityDsl from '../../abilitydsl.js';

export default class OfferingsToTheKami extends ProvinceCard {
    static id = 'offerings-to-the-kami';

    setupCardAbilities() {
        this.reaction('Resolve the ring as if you were the attacker')
            .when({
                onCardRevealed: (event, context) => event.card === context.source
            })
            .ringTarget('target', {
                activePromptTitle: 'Choose a ring to claim and resolve',
                player: Players.Self,
                ringCondition: (ring) => ring.isUnclaimed()
            }, AbilityDsl.actions.multiple([
                AbilityDsl.actions.resolveRingEffect((context) => ({ player: context.player })),
                AbilityDsl.actions.claimRing({ takeFate: true, type: 'political' })
            ]));
    }
}
