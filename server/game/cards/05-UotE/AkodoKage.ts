import { setHonorDial } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class AkodoKage extends DrawCard {
    static id = 'akodo-kage';

    override setupCardAbilities() {
        this.reaction('Set your opponent\'s dial to equal yours')
            .when({
                onHonorDialsRevealed: (event, context) =>
                    event.isHonorBid &&
                    context.player.opponent &&
                    context.player.honorBid < context.player.opponent.honorBid &&
                    context.player.isMoreHonorable()
            })
            .gameAction(setHonorDial((context) => ({ target: context.player.opponent ?? [], value: context.player.showBid })));
    }
}
