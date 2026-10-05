import AbilityDsl from '../../../abilitydsl.js';
import { CardType, Players, Element } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class OneWithTheSea extends DrawCard {
    static id = 'one-with-the-sea';

    setupCardAbilities() {
        this.action('Move a character you control to the conflict')
            .target({
                cardType: CardType.Character,
                controller: Players.Self
            }, AbilityDsl.actions.moveToConflict());

        this.action('Move any character to the conflict')
            .cost(AbilityDsl.costs.payFate(1))
            .condition((context) =>
                context.game.isDuringConflict() && context.game.rings[Element.Water].isConsideredClaimed(context.player))
            .target({
                cardType: CardType.Character,
                controller: Players.Any
            }, AbilityDsl.actions.moveToConflict())
            .max(AbilityDsl.limit.perRound(1));
    }
}
