import DrawCard from '../../drawcard.js';
import { Players, CardTypes } from '../../Constants.js';

class GiverOfGifts extends DrawCard {
    static id = 'giver-of-gifts';

    setupCardAbilities(ability) {
        this.action({
            title: 'Move an attachment',
            target: {
                cardType: CardTypes.Attachment,
                controller: Players.Self,
                gameAction: ability.actions.selectCard(context => ({
                    controller: Players.Self,
                    cardCondition: card => card !== context.target.parent,
                    message: '{0} moves {1} to {2}',
                    messageArgs: card => [context.player, context.target, card],
                    gameAction: ability.actions.attach({ attachment: context.target })
                }))
            },
            effect: 'move {0} to another character'
        });
    }
}


export default GiverOfGifts;
