import type AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { Players, CardType } from '../../Constants.js';

class GiverOfGifts extends DrawCard {
    static id = 'giver-of-gifts';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.action('Move an attachment')
            .target('target', {
                cardType: CardType.Attachment,
                controller: Players.Self
            }, ability.actions.selectCard((context) => ({
                controller: Players.Self,
                cardCondition: (card: DrawCard) => card !== (context.target).parentCharacter,
                message: '{0} moves {1} to {2}',
                messageArgs: (card: DrawCard) => [context.player, context.target, card],
                gameAction: ability.actions.attach({ attachment: context.target })
            })))
            .effect('move {0} to another character');
    }
}


export default GiverOfGifts;
