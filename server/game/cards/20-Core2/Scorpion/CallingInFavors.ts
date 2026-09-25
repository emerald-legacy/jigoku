import DrawCard from '../../../DrawCard.js';

export default class CallingInFavors extends DrawCard {
    static id = 'calling-in-favors';

    setupCardAbilities() {
        this.ability
            .action()
            .title('Take control of an attachment')
            .costs(($c) => ({ dishonored: $c.dishonor('character') }))
            .targets(($t) => ({ attachment: $t.card('attachment', { controller: (ctx) => ctx.opponent }) }))
            .effects(($e, ctx) => [
                $e
                    .ifAble($e.takeControlAndAttach(ctx.targets.attachment, ctx.costs.dishonored))
                    .otherwise($e.discardFromPlay(ctx.targets.attachment))
            ])
            .addPrinted();
    }
}
