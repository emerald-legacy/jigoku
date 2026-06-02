import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import { CardType, Players } from '../../../Constants.js';

class ShosuroBotanist extends DrawCard {
    static id = 'shosuro-botanist';

    setupCardAbilities() {
        this.action<DrawCard>({
            title: 'Return attachment to owners hand',
            target: {
                cardType: CardType.Attachment,
                controller: Players.Self,
                cardCondition: card => !card.hasTrait('weapon'),
                gameAction: AbilityDsl.actions.returnToHand()
            },
            effect: 'return {0} to {1}\'s hand',
            effectArgs: context => [context.target?.owner ?? '']
        });
    }
}

export default ShosuroBotanist;
