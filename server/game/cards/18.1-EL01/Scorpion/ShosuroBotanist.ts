import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import { CardTypes, Players } from '../../../Constants.js';

class ShosuroBotanist extends DrawCard {
    static id = 'shosuro-botanist';

    setupCardAbilities() {
        this.action<DrawCard>({
            title: 'Return attachment to owners hand',
            target: {
                cardType: CardTypes.Attachment,
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
