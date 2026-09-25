import DrawCard from '../../DrawCard.js';

export default class Banzai extends DrawCard {
    static id = 'banzai';

    setupCardAbilities() {
        this.ability
            .action()
            .title('Increase a character\'s military skill')
            .condition((ctx) => ctx.conflict !== undefined)
            .targets(($t) => ({ character: $t.card('character', { filter: (card) => card.isParticipating() }) }))
            .announce(($m, ctx) => $m.withIntro`grant 2 military skill to ${ctx.targets.character}`)
            .effects(($e, ctx) => [
                $e.lastingEffect(ctx.targets.character, ($mod) => [$mod.military(2)], { until: 'conflict' }),
                $e.mayPay(ctx.player, ($pay) => $pay.loseHonor(1), $e.resolveThisAbility({ twice: true }))
            ])
            .addPrinted(($limit) => ({ max: $limit.per('conflict', 1) }));
    }
}
