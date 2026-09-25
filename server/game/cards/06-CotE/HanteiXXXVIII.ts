import DrawCard from '../../DrawCard.js';

export default class HanteiXXXVIII extends DrawCard {
    static id = 'hantei-xxxviii';

    setupCardAbilities() {
        this.ability
            .stateCheck((ctx) => Boolean(ctx.opponent?.imperialFavor))
            .announce(
                ($m, ctx) =>
                    $m.freeform`${ctx.source} is discarded from play as its controller's opponent has the imperial favor`
            )
            .effects(($e, ctx) => [$e.discardFromPlay(ctx.source)])
            .addPrinted();

        this.ability
            .action()
            .title('Bow a character')
            .targets(($t) => ({ character: $t.card('character', { filter: (card) => card.isParticipating() }) }))
            .effects(($e, ctx) => [$e.bow(ctx.targets.character)])
            .addPrinted();

        this.ability
            .interrupt({
                onCardAbilityInitiated: (event, ctx) =>
                    event.ability.hasTargetsChosenByInitiatingPlayer(event.context) &&
                    event.context.player === ctx.opponent
            })
            .title('Choose targets for opponent\'s ability')
            .announce(
                ($m, ctx, util) =>
                    $m.withIntro`choose targets for ${ctx.event.card}'s ${util.titleOf(ctx.event.ability)} ability`
            )
            .effects(($e, ctx) => [$e.chooseTargetsInstead(ctx.event.context)])
            .addPrinted();
    }
}
