import { CardType, Players, Trait } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { ready } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import { msg } from '../../../GameChat.js';

export default class CampfireCounsel extends DrawCard {
    static id = 'campfire-counsel';

    override setupCardAbilities() {
        this.action('Ready a character')
            .cost(costs.sacrificeSelf())
            .target({
                cardType: CardType.Character,
                controller: Players.Self,
                cardCondition: (card) => card.costAtMost(3)
            }, ready())
            .thenIf((context) => !context.player.isCharacterTraitInPlay(Trait.Storyteller))
            .dishonor((context) => ({ target: context.target }))
            .message((context) => msg`${context.target} is dishonored`);
    }
}
