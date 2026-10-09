import { msg } from '../../GameChat.js';
import * as costs from '../../costs/index.js';
import { gainFate, gainHonor } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

class WindsweptYurt extends DrawCard {
    static id = 'windswept-yurt';

    setupCardAbilities() {
        this.action('Gain 2 fate or 2 honor')
            .cost(costs.sacrificeSelf())
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
            .refillFaceup((context) => ({ location: context.cardStateWhenInitiated?.location ?? [] }))
            .chatText((context) => msg`give each player 2 ${context.select === 'Each player gains 2 fate' ? 'fate' : 'honor'}`);
    }
}


export default WindsweptYurt;
