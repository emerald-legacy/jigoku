import DrawCard from '../../DrawCard.js';

export default class ReturnTheOffense extends DrawCard {
    static id = 'return-the-offense';

    setupCardAbilities() {
        this.ability
            .action()
            .title('Initiate a political duel')
            .condition((ctx) => ctx.conflict !== undefined)
            .politicalDuel({ anyControllers: true })
            .announce(($message, ctx) => {
                const { winner, loser } = ctx.duel;
                return $message.withIntro`${winner} does not bow as a result of conflict resolution${loser.length > 0 ? ' and ' : ''}${loser}${loser.length > 0 ? ' cannot be readied' : ''}`;
            })
            .effects(($effect, ctx) => [
                $effect.lastingEffect(ctx.duel.winner, ($modifier) => [$modifier.doesNotBow()], { until: 'conflict' }),
                $effect.lastingEffect(ctx.duel.loser, ($modifier) => [$modifier.cannotBeReadiedByCardEffects()], { until: 'conflict' })
            ])
            .addPrinted();
    }
}
