import { CardType, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class ContemplateTheEternal extends DrawCard {
    static id = 'contemplate-the-eternal';

    public setupCardAbilities() {
        this.action('Return rings to put fate on character')
            .cost(AbilityDsl.costs.returnRings())
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) =>
                    !card.bowed && !card.attachments.some((attachment) => !attachment.hasTrait('tattoo'))
            }, AbilityDsl.actions.placeFate((context) => ({
                amount: context.costs.returnRing ? context.costs.returnRing.length : 1
            })));
    }
}
