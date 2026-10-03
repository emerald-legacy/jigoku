import AbilityDsl from '../../../abilitydsl.js';
import { CardType, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class OneWithTheSea extends DrawCard {
    static id = 'one-with-the-sea';

    setupCardAbilities() {
        this.action('Move a character you control to the conflict')
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Self
            }, AbilityDsl.actions.moveToConflict());

        this.action('Move any character to the conflict')
            .cost(AbilityDsl.costs.payFate(1))
            .condition((context) =>
                context.game.isDuringConflict() && context.game.rings['water'].isConsideredClaimed(context.player))
            .target('target', {
                cardType: CardType.Character,
                controller: Players.Any
            }, AbilityDsl.actions.moveToConflict())
            .max(AbilityDsl.limit.perRound(1));
    }
}
