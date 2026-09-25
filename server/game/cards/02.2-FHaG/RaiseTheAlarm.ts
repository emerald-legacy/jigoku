import DrawCard from '../../DrawCard.js';

export default class RaiseTheAlarm extends DrawCard {
    static id = 'raise-the-alarm';

    setupCardAbilities() {
        this.ability
            .militaryConflictAction()
            .title('Flip a dynasty card')
            .condition((ctx) => ctx.player.isDefendingPlayer())
            .targets(($t) => ({
                card: $t.anyCard({
                    from: (ctx, util) => util.cardsInConflictProvince(ctx.player),
                    filter: (card) => card.isFacedown()
                })
            }))
            .announce(($m) => $m.withIntro`flip the card in the conflict province faceup`)
            .effects(($e, ctx) => [$e.flipDynasty(ctx.targets.card)])
            .thenIf(
                ($e, ctx, util) =>
                    util.is(ctx.targets.card, 'character') && $e.putIntoConflict(ctx.targets.card).canAffect()
            )
            .announce(($m, ctx) => $m.freeform`${ctx.targets.card} is revealed and brought into the conflict!`)
            .effects(($e, ctx) => [$e.putIntoConflict(ctx.targets.card)])
            .otherwise()
            .announce(
                ($m, ctx) => $m.freeform`${ctx.targets.card} is revealed but cannot be brought into the conflict!`
            )
            .addPrinted();
    }
}
