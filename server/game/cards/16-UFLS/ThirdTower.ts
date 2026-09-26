import DrawCard from '../../DrawCard.js';

export default class ThirdTower extends DrawCard {
    static id = 'third-tower';

    setupCardAbilities() {
        this.ability
            .reaction({
                onConflictDeclared: (event, ctx, util) => {
                    const province = event.conflict.declaredProvince;
                    return (
                        event.conflict.attackingPlayer !== ctx.player &&
                        !!province &&
                        !ctx.player
                            .getDynastyCardsInProvince(province.location)
                            .some((card) => card.isFaceup() && util.is(card, 'holding') && card.hasTrait('kaiu-wall'))
                    );
                }
            })
            .title('Take an honor from your opponent')
            .effects(($effect, ctx) => [$effect.takeHonor({ from: ctx.event.conflict.attackingPlayer })])
            .addPrinted(($limit) => ({ limit: $limit.unlimitedPerConflict() }));
    }
}
