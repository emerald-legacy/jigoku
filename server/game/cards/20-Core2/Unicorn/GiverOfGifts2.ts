import AbilityDsl from '../../../abilitydsl.js';
import { CardType, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class GiverOfGifts2 extends DrawCard {
    static id = 'giver-of-gifts-2';

    setupCardAbilities() {
        this.action('Move an attachment')
            .target('target', {
                cardType: CardType.Attachment,
                controller: Players.Self
            }, AbilityDsl.actions.selectCard((context) => ({
                cardCondition: (card) =>
                    card !== context.target?.parentCharacter && card.controller === context.target?.parentCharacter?.controller,
                message: '{0} moves {1} to {2}',
                messageArgs: (card) => [context.player, context.target, card],
                gameAction: AbilityDsl.actions.attach({ attachment: context.target })
            })))
            .effect('move {0} to another character');
    }
}
