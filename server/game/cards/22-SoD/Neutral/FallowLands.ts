import { ProvinceCard } from '../../../ProvinceCard';
import AbilityDsl from '../../../abilitydsl';

export default class FallowLands extends ProvinceCard {
    static id = 'fallow-lands';

    setupCardAbilities() {
        this.reaction({
            title: 'Gain resources',
            when: {
                onCardRevealed: (event, context) => event.card === context.source
            },
            effect: 'draw 1 card, gain 1 fate, and gain 1 honor',
            gameAction: AbilityDsl.actions.multiple([
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
            ])
        });
    }
}
