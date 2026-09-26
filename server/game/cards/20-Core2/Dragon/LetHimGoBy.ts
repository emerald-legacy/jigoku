import DrawCard from '../../../DrawCard.js';

function militarySkill(cards: readonly DrawCard[]): number {
    return cards.reduce((total, card) => total + card.getMilitarySkill(), 0);
}

export default class LetHimGoBy extends DrawCard {
    static id = 'let-him-go-by';

    public setupCardAbilities() {
        this.ability
            .reaction({
                onMoveToConflict: (event, ctx) => (event.card.controller === ctx.opponent ? event.card : undefined),
                onCardPlayed: (event, ctx) =>
                    event.card.controller === ctx.opponent && event.card.isParticipating() ? event.card : undefined
            })
            .title('Bow a character')
            .effects(($effect, ctx) => [$effect.bow(ctx.matched)])
            .addPrinted();

        this.ability
            .conflictAction()
            .title('Challenge a character anywhere to a duel')
            .targets(($target) => ({ duel: $target.militaryDuel({ challenged: { anyLocation: true } }) }))
            .effects(($effect, ctx) => [
                $effect.resolveDuel(
                    ctx.targets.duel,
                    (outcome) => [
                        $effect.lastingEffect(
                            outcome.winner,
                            ($modifier) => [$modifier.military(militarySkill(outcome.loser))],
                            { until: 'conflict' }
                        )
                    ],
                    {
                        announce: ($message, outcome) =>
                            $message.freeform`${outcome.winner} gets +${militarySkill(outcome.loser)}military skill`
                    }
                )
            ])
            .addPrinted(($limit) => ({ max: $limit.per('conflict', 1) }));
    }
}
