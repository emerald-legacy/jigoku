import DrawCard from '../../DrawCard.js';

export default class ReturnTheOffense extends DrawCard {
    static id = 'return-the-offense';

    setupCardAbilities() {
        this.ability
            .action()
            .title('Initiate a political duel')
            .condition((ctx) => ctx.conflict !== undefined)
            .politicalDuel({ anyControllers: true })
            .announce(($m, ctx) => {
                const { winner, loser } = ctx.duel;
                return $m.withIntro`${winner} does not bow as a result of conflict resolution${loser.length > 0 ? ' and ' : ''}${loser}${loser.length > 0 ? ' cannot be readied' : ''}`;
            })
            .effects(($e, ctx) => [
                $e.lastingEffect(ctx.duel.winner, ($mod) => [$mod.doesNotBow()], { until: 'conflict' }),
                $e.lastingEffect(ctx.duel.loser, ($mod) => [$mod.cannotBeReadiedByCardEffects()], { until: 'conflict' })
            ])
            .addPrinted();
    }
}
