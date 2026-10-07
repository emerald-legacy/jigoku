import { CardType, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import { ready } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { msg } from '../../../GameChat.js';

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
            .thenIf((context) => !context.player.isCharacterTraitInPlay('storyteller'))
            .dishonor((context) => ({ target: context.target }))
            .message((context) => msg`${context.target} is dishonored`);
    }
}
