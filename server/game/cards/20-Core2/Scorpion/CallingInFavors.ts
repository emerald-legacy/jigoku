import DrawCard from '../../../DrawCard.js';

export default class CallingInFavors extends DrawCard {
    static id = 'calling-in-favors';

    setupCardAbilities() {
        this.ability
            .action()
            .title('Take control of an attachment')
            .costs(($cost) => ({ dishonored: $cost.dishonor('character') }))
            .targets(($target) => ({ attachment: $target.card('attachment', { controller: (ctx) => ctx.opponent }) }))
            .effects(($effect, ctx) => [
                $effect
                    .ifAble($effect.takeControlAndAttach(ctx.targets.attachment, ctx.costs.dishonored))
                    .otherwise($effect.discardFromPlay(ctx.targets.attachment))
            ])
            .addPrinted();
    }
}
