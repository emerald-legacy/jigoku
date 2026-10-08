import type { AbilityContext } from '../../../AbilityContext.js';
import * as costs from '../../../costs/index.js';
import { removeFate } from '../../../GameActions/GameActions.js';
import { CardType, Phase, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class ParanoidHososhi extends DrawCard {
    static id = 'paranoid-hososhi';

    public setupCardAbilities() {
        this.legendary(2);

        this.action('Steal fate from a character')
            .cost(costs.bowSelf())
            .target({
                controller: Players.Any,
                cardType: CardType.Character,
                cardCondition: (card, context) => card.getCost() === this.getHighestCostOfCharactersInPlay(context)
            }, removeFate((context) => ({
                recipient: context.player
            })))
            .chatText('take 1 fate from {0} — evil begone')
            .phase(Phase.Conflict);
    }

    private getHighestCostOfCharactersInPlay(context: AbilityContext) {
        return context.game
            .findAnyCardsInPlay((card) => card.type === CardType.Character)
            .reduce((prevHighestCost, card) => {
                const cost = card.getCost();
                return typeof cost === 'number' && cost > prevHighestCost ? cost : prevHighestCost;
            }, 0);
    }
}
