import DrawCard from '../../DrawCard.js';

export default class KeeperInitiate extends DrawCard {
    static id = 'keeper-initiate';

    setupCardAbilities() {
        this.ability
            .reaction({
                onClaimRing: (event, ctx) => {
                    const role = ctx.player.role;
                    const elements = [...(event.conflict?.elements ?? []), event.ring.element];
                    return event.player === ctx.player && !!role && elements.some((element) => role.hasTrait(element));
                }
            })
            .title('Put this into play')
            .from('provinces', 'dynastyDiscardPile')
            .effects(($effect, ctx) => [$effect.putIntoPlay(ctx.source)])
            .then()
            .effects(($effect, ctx) => [$effect.placeFate(ctx.source, 1)])
            .addPrinted();
    }
}
