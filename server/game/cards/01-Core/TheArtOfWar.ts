import { ProvinceCard } from '../../ProvinceCard.js';
import { draw } from '../../GameActions/GameActions.js';

export default class TheArtOfWar extends ProvinceCard {
    static id = 'the-art-of-war';

    setupCardAbilities() {
        this.interrupt('Draw 3 cards')
            .when({
                onBreakProvince: (event, context) => event.card === context.source
            })
            .gameAction(draw({ amount: 3 }));
    }
}
