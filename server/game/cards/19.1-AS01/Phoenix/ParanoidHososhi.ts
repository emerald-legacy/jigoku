import { AbilityContext } from '../../../AbilityContext.js';
import AbilityDsl from '../../../abilitydsl.js';
import BaseCard from '../../../basecard.js';
import { CardTypes, Phases, Players } from '../../../Constants.js';
import DrawCard from '../../../drawcard.js';

export default class ParanoidHososhi extends DrawCard {
    static id = 'paranoid-hososhi';

    public setupCardAbilities() {
        this.legendary(2);

        this.action({
            title: 'Steal fate from a character',
            phase: Phases.Conflict,
            cost: AbilityDsl.costs.bowSelf(),
            target: {
                controller: Players.Any,
                cardType: CardTypes.Character,
                cardCondition: (card, context) => card.getCost() === this.getHighestCostOfCharactersInPlay(context),
                gameAction: AbilityDsl.actions.removeFate((context) => ({
                    amount: 1,
                    recipient: context.player
                }))
            },
            effect: 'take 1 fate from {0} — evil begone!'
        });
    }

    private getHighestCostOfCharactersInPlay(context: AbilityContext) {
        return context.game
            .findAnyCardsInPlay((card: BaseCard) => card.type === CardTypes.Character)
            .reduce((prevHighestCost: number, card: DrawCard) => {
                const cost = card.getCost();
                return typeof cost === 'number' && cost > prevHighestCost ? cost : prevHighestCost;
            }, 0);
    }
}
