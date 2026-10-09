import DrawCard from '../../DrawCard.js';
import { honor } from '../../GameActions/GameActions.js';
import { CardType } from '../../Constants.js';
import { isOpponentsRingOrCardEffect } from '../effectSource.js';

class RighteousSamurai extends DrawCard {
    static id = 'righteous-samurai';

    setupCardAbilities() {
        this.reaction('Honor a character')
            .when({
                onModifyHonor: (event, context) =>
                    event.amount < 0 && event.player === context.player && isOpponentsRingOrCardEffect(context.player, event.context),
                onTransferHonor: (event, context) =>
                    event.amount > 0 && event.player === context.player && isOpponentsRingOrCardEffect(context.player, event.context)
            })
            .target({
                cardType: CardType.Character
            }, honor());
    }
}


export default RighteousSamurai;
