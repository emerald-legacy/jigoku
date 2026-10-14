import * as costs from '../../costs/index.js';
import { gainFate, gainHonor } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

class WindsweptYurt extends DrawCard {
    static id = 'windswept-yurt';

    setupCardAbilities() {
        this.action('Gain 2 fate or 2 honor')
            .cost(costs.sacrificeSelf())
            .select({
                'Each player gains 2 fate': {
                    action: gainFate((context) => ({
                        amount: 2,
                        target: context.game.getPlayers()
                    })),
                    chatText: 'give each player 2 fate'
                },
                'Each player gains 2 honor': {
                    action: gainHonor((context) => ({
                        amount: 2,
                        target: context.game.getPlayers()
                    })),
                    chatText: 'give each player 2 honor'
                }
            })
            .refillFaceup((context) => ({ location: context.cardStateWhenInitiated?.location ?? [] }));
    }
}


export default WindsweptYurt;
