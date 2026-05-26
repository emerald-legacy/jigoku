import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../drawcard.js';
import { Players, CardTypes } from '../../Constants.js';

class GiverOfGifts extends DrawCard {
    static id = 'giver-of-gifts';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action({
            title: 'Move an attachment',
            target: {
                cardType: CardTypes.Attachment,
                controller: Players.Self,
                gameAction: ability.actions.selectCard((context: any) => ({
                    controller: Players.Self,
                    cardCondition: (card: any) => card !== context.target.parent,
                    message: '{0} moves {1} to {2}',
                    messageArgs: (card: any) => [context.player, context.target, card],
                    gameAction: ability.actions.attach({ attachment: context.target })
                }))
            },
            effect: 'move {0} to another character'
        });
    }
}


export default GiverOfGifts;
