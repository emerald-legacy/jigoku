import DrawCard from '../../../DrawCard.js';

export default class JakIthith extends DrawCard {
    static id = 'jak-ithith';

    setupCardAbilities() {
        this.ability
            .constant()
            .appliesTo(($subject) => $subject.self())
            .modifiers(($modifier) => [
                $modifier.immuneToCardsWithTrait('maho'),
                $modifier.immuneToCardsWithTrait('shadowlands'),
                $modifier.cannotReceiveTaintedToken()
            ])
            .addPrinted();

        this.ability
            .reaction({
                afterConflict: (event, ctx) => event.conflict.winner === ctx.player && ctx.source.isParticipating()
            })
            .title('Take control of an attachment')
            .targets(($target) => ({
                attachment: $target.card('attachment', { filter: (card, ctx, util) => util.onEnemySide(card) })
            }))
            .targets(($target) => ({
                receiver: $target.card('character', {
                    controller: (ctx) => ctx.player,
                    filter: (card) => card.isParticipating()
                })
            }))
            .effects(($effect, ctx) => [
                $effect
                    .ifAble($effect.takeControlAndAttach(ctx.targets.attachment, ctx.targets.receiver))
                    .otherwise($effect.discardFromPlay(ctx.targets.attachment))
            ])
            .addPrinted();
    }
}
