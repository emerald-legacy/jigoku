import AbilityDsl from '../../abilitydsl.js';
import { gainFate, gainHonor, refillFaceup } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

class WindsweptYurt extends DrawCard {
    static id = 'windswept-yurt';

    setupCardAbilities() {
        this.action('Gain 2 fate or 2 honor')
            .cost(AbilityDsl.costs.sacrificeSelf())
            .select({}, {
                'Each player gains 2 fate': gainFate((context) => ({
                    amount: 2,
                    target: context.game.getPlayers()
                })),
                'Each player gains 2 honor': gainHonor((context) => ({
                    amount: 2,
                    target: context.game.getPlayers()
                }))
            })
            .gameAction(refillFaceup((context) => ({ location: context.cardStateWhenInitiated?.location ?? [] })))
            .effect('give each player 2 {1}', context => context.select === 'Each player gains 2 fate' ? 'fate' : 'honor');
    }
}


export default WindsweptYurt;
