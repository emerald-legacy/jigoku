import { ProvinceCard } from '../../../ProvinceCard.js';

export default class FallowLands extends ProvinceCard {
    static id = 'fallow-lands';

    setupCardAbilities() {
        this.reaction('Gain resources')
            .when({
                onCardRevealed: (event, context) => event.card === context.source
            })
            .draw((context) => ({
                target: context.player
            }))
            .gainFate((context) => ({
                target: context.player
            }))
            .gainHonor((context) => ({
                target: context.player
            }))
            .chatText('draw 1 card, gain 1 fate, and gain 1 honor');
    }
}
