import DrawCard from '../../DrawCard.js';
import { CardType } from '../../Constants.js';
import { isOpponentsRingOrCardEffect } from '../effectSource.js';

class ArdentOmoidasu extends DrawCard {
    static id = 'ardent-omoidasu';

    setupCardAbilities() {
        this.reaction('Steal 2 honor')
            .when({
                onCardDishonored: (event, context) =>
                    event.card.type === CardType.Character && event.card.controller === context.player &&
                    isOpponentsRingOrCardEffect(context.player, event.context)
            })
            .takeHonor({
                amount: 2
            });
    }
}


export default ArdentOmoidasu;
