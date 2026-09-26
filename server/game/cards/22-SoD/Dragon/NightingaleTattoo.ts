import DrawCard from '../../../DrawCard.js';

export default class NightingaleTattoo extends DrawCard {
    static id = 'nightingale-tattoo';

    setupCardAbilities() {
        this.attachmentConditions({ myControl: true, trait: 'monk' });

        this.ability
            .constant()
            .appliesTo(($subject) => $subject.attachedCharacter())
            .modifiers(($modifier) => [$modifier.addTrait('tattooed')])
            .addPrinted();

        this.ability
            .action()
            .title('Pick two cards in your discard pile')
            .targets(($target) => ({
                cards: $target.cards(['character', 'attachment', 'event'], {
                    exactly: 2,
                    prompt: 'Choose two conflict cards',
                    from: (ctx) => ctx.player.conflictDiscardPile,
                    filter: (card) => card.hasTrait('kiho') || card.hasTrait('tattoo')
                })
            }))
            .announce(($message, ctx) =>
                $message.withIntro`have ${ctx.opponent} shuffle one of ${ctx.targets.cards} into ${ctx.player}'s conflict deck`
            )
            .effects(($effect, ctx) => [
                $effect.assign(
                    ctx.targets.cards,
                    {
                        shuffle: (card) => $effect.shuffleIntoDeck(card),
                        remove: (card) => $effect.removeFromGame(card)
                    },
                    {
                        chooser: ctx.opponent,
                        pick: 'shuffle',
                        prompt: 'Choose a card to shuffle into your opponent\'s deck',
                        announce: ($message, { shuffle, remove }) =>
                            $message.freeform`${ctx.opponent} chooses ${shuffle} to be shuffled into ${ctx.player}'s deck. ${remove} is removed from the game`
                    }
                )
            ])
            .addPrinted();
    }
}
