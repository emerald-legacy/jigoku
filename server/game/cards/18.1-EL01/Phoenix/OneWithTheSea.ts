import * as costs from '../../../costs/index.js';
import { perRound } from '../../../AbilityLimit.js';
import { moveToConflict } from '../../../GameActions/GameActions.js';
import { CardType, Players, Element } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class OneWithTheSea extends DrawCard {
    static id = 'one-with-the-sea';

    setupCardAbilities() {
        this.action('Move a character you control to the conflict')
            .target({
                cardType: CardType.Character,
                controller: Players.Self
            }, moveToConflict());

        this.action('Move any character to the conflict')
            .cost(costs.payFate(1))
            .condition((context) =>
                context.game.isDuringConflict() && context.game.rings[Element.Water].isConsideredClaimed(context.player))
            .target({
                cardType: CardType.Character,
                controller: Players.Any
            }, moveToConflict())
            .max(perRound(1));
    }
}
