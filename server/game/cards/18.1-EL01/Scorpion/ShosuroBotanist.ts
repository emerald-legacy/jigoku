import DrawCard from '../../../DrawCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import { CardType, Players } from '../../../Constants.js';

class ShosuroBotanist extends DrawCard {
    static id = 'shosuro-botanist';

    setupCardAbilities() {
        this.action('Return attachment to owners hand')
            .target('target', {
                cardType: CardType.Attachment,
                controller: Players.Self,
                cardCondition: card => !card.hasTrait('weapon')
            }, AbilityDsl.actions.returnToHand())
            .effect('return {0} to {1}\'s hand', context => [context.target?.owner ?? '']);
    }
}

export default ShosuroBotanist;
