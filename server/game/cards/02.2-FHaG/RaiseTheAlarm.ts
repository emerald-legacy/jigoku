import DrawCard from '../../DrawCard.js';

export default class RaiseTheAlarm extends DrawCard {
    static id = 'raise-the-alarm';

    setupCardAbilities() {
        this.ability
            .militaryConflictAction()
            .title('Flip a dynasty card')
            .condition((ctx) => ctx.player.isDefendingPlayer())
            .targets(($target) => ({
                card: $target.anyCard({
                    from: (ctx, util) => util.cardsInConflictProvince(ctx.player),
                    filter: (card) => card.isFacedown()
                })
            }))
            .announce(($message) => $message.withIntro`flip the card in the conflict province faceup`)
            .effects(($effect, ctx) => [$effect.flipDynasty(ctx.targets.card)])
            .thenIf(
                ($effect, ctx, util) =>
                    util.is(ctx.targets.card, 'character') && $effect.putIntoConflict(ctx.targets.card).canAffect()
            )
            .announce(($message, ctx) => $message.freeform`${ctx.targets.card} is revealed and brought into the conflict!`)
            .effects(($effect, ctx) => [$effect.putIntoConflict(ctx.targets.card)])
            .otherwise()
            .announce(
                ($message, ctx) => $message.freeform`${ctx.targets.card} is revealed but cannot be brought into the conflict!`
            )
            .addPrinted();
    }
}
