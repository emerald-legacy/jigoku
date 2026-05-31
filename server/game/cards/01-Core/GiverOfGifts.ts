import type AbilityDsl from '../../abilitydsl.js';
import type { AbilityContext } from '../../AbilityContext.js';
import DrawCard from '../../DrawCard.js';
import { Players, CardTypes } from '../../Constants.js';

class GiverOfGifts extends DrawCard {
    static id = 'giver-of-gifts';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Move an attachment',
            target: {
                cardType: CardTypes.Attachment,
                controller: Players.Self,
                gameAction: ability.actions.selectCard((context: AbilityContext) => ({
                    controller: Players.Self,
                    cardCondition: (card: DrawCard) => card !== (context.target as DrawCard).parent,
                    message: '{0} moves {1} to {2}',
                    messageArgs: (card: DrawCard) => [context.player, context.target, card],
                    gameAction: ability.actions.attach({ attachment: context.target as DrawCard })
                }))
            },
            effect: 'move {0} to another character'
        });
    }
}


export default GiverOfGifts;
