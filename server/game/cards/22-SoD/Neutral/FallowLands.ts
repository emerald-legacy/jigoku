import { ProvinceCard } from '../../../ProvinceCard.js';
import { draw, gainFate, gainHonor, multiple } from '../../../GameActions/GameActions.js';

export default class FallowLands extends ProvinceCard {
    static id = 'fallow-lands';

    setupCardAbilities() {
        this.reaction('Gain resources')
            .when({
                onCardRevealed: (event, context) => event.card === context.source
            })
            .gameAction(multiple([
                draw(context => ({
                    target: context.player
                })),
                gainFate(context => ({
                    target: context.player
                })),
                gainHonor(context => ({
                    target: context.player
                }))
            ]))
            .effect('draw 1 card, gain 1 fate, and gain 1 honor');
    }
}
