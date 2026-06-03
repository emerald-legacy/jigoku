import { CardType, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class CampfireCounsel extends DrawCard {
    static id = 'campfire-counsel';

    setupCardAbilities() {
        this.action({
            title: 'Ready a character',
            cost: AbilityDsl.costs.sacrificeSelf(),
            target: {
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: card => card.printedCost <= 3,
                gameAction: AbilityDsl.actions.ready()
            },
            then: context => ({
                thenCondition: () => !!context && !context.player.isCharacterTraitInPlay('storyteller'),
                gameAction: AbilityDsl.actions.dishonor({
                    target: context?.target
                }),
                message: '{3} is dishonored',
                messageArgs: () => [context?.target]
            })
        });
    }
}
