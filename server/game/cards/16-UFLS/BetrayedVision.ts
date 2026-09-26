import DrawCard from '../../DrawCard.js';

export default class BetrayedVision extends DrawCard {
    static id = 'betrayed-vision';

    setupCardAbilities() {
        this.ability.playOnlyIf((ctx) => ctx.player.anyCardsInPlay((card) => card.hasTrait('shugenja')));

        this.ability
            .conflictAction()
            .title('Make a character a copy')
            .targets(($target) => ({
                original: $target.card('character', {
                    prompt: 'Choose a character to copy',
                    filter: (card) => !card.isUnique()
                })
            }))
            .targets(($target) => ({
                copy: $target.card('character', {
                    prompt: 'Choose a character to turn into the copy',
                    controller: (ctx) => ctx.opponent,
                    filter: (card, ctx) => card.isParticipating() && card !== ctx.targets.original
                })
            }))
            .announce(($message, ctx) => $message.withIntro`make ${ctx.targets.copy} into a copy of ${ctx.targets.original}`)
            .effects(($effect, ctx) => [
                $effect.lastingEffect(ctx.targets.copy, ($modifier) => [$modifier.copyOf(ctx.targets.original)], {
                    until: 'conflict'
                })
            ])
            .addPrinted();
    }
}
