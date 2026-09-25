import DrawCard from '../../DrawCard.js';

export default class Banzai extends DrawCard {
    static id = 'banzai';

    setupCardAbilities() {
        this.ability
            .action()
            .title('Increase a character\'s military skill')
            .condition((ctx) => ctx.conflict !== undefined)
            .targets(($target) => ({ character: $target.card('character', { filter: (card) => card.isParticipating() }) }))
            .announce(($message, ctx) => $message.withIntro`grant 2 military skill to ${ctx.targets.character}`)
            .effects(($effect, ctx) => [
                $effect.lastingEffect(ctx.targets.character, ($modifier) => [$modifier.military(2)], { until: 'conflict' }),
                $effect.mayPay(ctx.player, ($payment) => $payment.loseHonor(1), $effect.resolveThisAbility({ twice: true }))
            ])
            .addPrinted(($limit) => ({ max: $limit.per('conflict', 1) }));
    }
}
