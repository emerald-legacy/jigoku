import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
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
            }, AbilityDsl.actions.honor());
    }
}


export default RighteousSamurai;
