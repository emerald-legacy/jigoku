import DrawCard from '../../DrawCard.js';

export default class HanteiXXXVIII extends DrawCard {
    static id = 'hantei-xxxviii';

    setupCardAbilities() {
        this.ability
            .whenever((ctx) => Boolean(ctx.opponent?.imperialFavor))
            .announce(
                ($message, ctx) =>
                    $message.freeform`${ctx.source} is discarded from play as its controller's opponent has the imperial favor`
            )
            .effects(($effect, ctx) => [$effect.discardFromPlay(ctx.source)])
            .addPrinted();

        this.ability
            .action()
            .title('Bow a character')
            .targets(($target) => ({ character: $target.card('character', { filter: (card) => card.isParticipating() }) }))
            .effects(($effect, ctx) => [$effect.bow(ctx.targets.character)])
            .addPrinted();

        this.ability
            .interrupt({
                onCardAbilityInitiated: (event, ctx) =>
                    event.ability.hasTargetsChosenByInitiatingPlayer(event.context) &&
                    event.context.player === ctx.opponent
            })
            .title('Choose targets for opponent\'s ability')
            .announce(
                ($message, ctx, util) =>
                    $message.withIntro`choose targets for ${ctx.event.card}'s ${util.titleOf(ctx.event.ability)} ability`
            )
            .effects(($effect, ctx) => [$effect.chooseTargetsInstead(ctx.event.context)])
            .addPrinted();
    }
}
