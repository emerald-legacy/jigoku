import DrawCard from '../../DrawCard.js';

export default class ReturnTheOffense extends DrawCard {
    static id = 'return-the-offense';

    setupCardAbilities() {
        this.ability
            .action()
            .title('Initiate a political duel')
            .condition((ctx) => ctx.conflict !== undefined)
            .targets(($target) => ({ duel: $target.politicalDuel() }))
            .effects(($effect, ctx) => [
                $effect.resolveDuel(
                    ctx.targets.duel,
                    (outcome) => [
                        $effect.lastingEffect(outcome.winner, ($modifier) => [$modifier.doesNotBow()], {
                            until: 'conflict'
                        }),
                        $effect.lastingEffect(
                            outcome.loser,
                            ($modifier) => [$modifier.cannotBeReadiedByCardEffects()],
                            {
                                until: 'conflict'
                            }
                        )
                    ],
                    {
                        announce: ($message, { winner, loser }) =>
                            $message.freeform`${winner} does not bow as a result of conflict resolution${loser.length > 0 ? ' and ' : ''}${loser}${loser.length > 0 ? ' cannot be readied' : ''}`
                    }
                )
            ])
            .addPrinted();
    }
}
