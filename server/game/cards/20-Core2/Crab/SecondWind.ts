import DrawCard from '../../../DrawCard.js';

export default class SecondWind extends DrawCard {
    static id = 'second-wind';

    public setupCardAbilities() {
        this.ability
            .conflictAction()
            .title('put a character from your discard pile into play')
            .announce(
                ($m, ctx) =>
                    $m.withIntro`find a character to put into play. ${ctx.player} discards ${ctx.player.dynastyDeck.slice(0, 4)}`
            )
            .effects(($e, ctx) => [$e.discard(ctx.player.dynastyDeck.slice(0, 4))])
            .then()
            .targets(($t) => ({
                character: $t.card('character', {
                    from: (ctx) => ctx.player.dynastyDiscardPile,
                    filter: (card) => !card.isUnique()
                })
            }))
            .announce(
                ($m, ctx) =>
                    $m.freeform`${ctx.player} puts ${ctx.targets.character} into play. ${ctx.targets.character} will be put on the bottom of the deck if it's still in play by the end of the conflict`
            )
            .effects(($e, ctx) => [
                $e.putIntoConflict(ctx.targets.character),
                $e.delayed(ctx.targets.character, {
                    when: { onConflictFinished: () => true },
                    then: { effects: ($e) => [$e.putOnBottomOfDeck(ctx.targets.character)] }
                })
            ])
            .addPrinted();
    }
}
