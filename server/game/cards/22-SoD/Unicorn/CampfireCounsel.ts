import { CardType, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import { dishonor, ready } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class CampfireCounsel extends DrawCard {
    static id = 'campfire-counsel';

    setupCardAbilities() {
        this.action('Ready a character')
            .cost(AbilityDsl.costs.sacrificeSelf())
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: card => (card.printedCost ?? 0) <= 3
            }, ready())
            .then(context => ({
                thenCondition: () => !context.player.isCharacterTraitInPlay('storyteller'),
                gameAction: dishonor({
                    target: context.target
                }),
                message: '{3} is dishonored',
                messageArgs: () => [context.target]
            }));
    }
}
