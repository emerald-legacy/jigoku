import { ProvinceCard } from '../../ProvinceCard.js';

export default class RestorationOfBalance extends ProvinceCard {
    static id = 'restoration-of-balance';

    public setupCardAbilities() {
        this.interrupt('Force opponent to discard to 4 cards')
            .when({
                onBreakProvince: (event, context) =>
                    event.card === context.source && context.player.opponent !== undefined
            })
            .chosenDiscard((context) => ({
                amount: Math.max(0, (context.player.opponent?.hand.length ?? 0) - 4)
            }));
    }
}
