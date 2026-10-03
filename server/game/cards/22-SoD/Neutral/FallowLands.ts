import { ProvinceCard } from '../../../ProvinceCard.js';
import AbilityDsl from '../../../abilitydsl.js';

export default class FallowLands extends ProvinceCard {
    static id = 'fallow-lands';

    setupCardAbilities() {
        this.reaction('Gain resources')
            .when({
                onCardRevealed: (event, context) => event.card === context.source
            })
            .gameAction(AbilityDsl.actions.multiple([
                AbilityDsl.actions.draw(context => ({
                    amount: 1,
                    target: context.player
                })),
                AbilityDsl.actions.gainFate(context => ({
                    amount: 1,
                    target: context.player
                })),
                AbilityDsl.actions.gainHonor(context => ({
                    amount: 1,
                    target: context.player
                }))
            ]))
            .effect('draw 1 card, gain 1 fate, and gain 1 honor');
    }
}
