import DrawCard from '../../../DrawCard.js';

export default class SecondWind extends DrawCard {
    static id = 'second-wind';

    public setupCardAbilities() {
        this.ability
            .conflictAction()
            .title('put a character from your discard pile into play')
            .announce(
                ($message, ctx) =>
                    $message.withIntro`find a character to put into play. ${ctx.player} discards ${ctx.player.dynastyDeck.slice(0, 4)}`
            )
            .effects(($effect, ctx) => [$effect.discard(ctx.player.dynastyDeck.slice(0, 4))])
            .then()
            .targets(($target) => ({
                character: $target.card('character', {
                    from: (ctx) => ctx.player.dynastyDiscardPile,
                    filter: (card) => !card.isUnique()
                })
            }))
            .announce(
                ($message, ctx) =>
                    $message.freeform`${ctx.player} puts ${ctx.targets.character} into play. ${ctx.targets.character} will be put on the bottom of the deck if it's still in play by the end of the conflict`
            )
            .effects(($effect, ctx) => [
                $effect.putIntoConflict(ctx.targets.character),
                $effect.delayed(ctx.targets.character, {
                    when: { onConflictFinished: () => true },
                    then: { effects: ($effect) => [$effect.putOnBottomOfDeck(ctx.targets.character)] }
                })
            ])
            .addPrinted();
    }
}
