import { ProvinceCard } from '../../ProvinceCard.js';

export default class TheArtOfWar extends ProvinceCard {
    static id = 'the-art-of-war';

    override setupCardAbilities() {
        this.interrupt('Draw 3 cards')
            .when({
                onBreakProvince: (event, context) => event.card === context.source
            })
            .draw(3);
    }
}
