import { AbilityContext } from '../../../AbilityContext.js';
import AbilityDsl from '../../../abilitydsl.js';
import BaseCard from '../../../BaseCard.js';
import { CardType, Phases, Players } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class ParanoidHososhi extends DrawCard {
    static id = 'paranoid-hososhi';

    public setupCardAbilities() {
        this.legendary(2);

        this.action('Steal fate from a character')
            .cost(AbilityDsl.costs.bowSelf())
            .target('target', {
                controller: Players.Any,
                cardType: CardType.Character,
                cardCondition: (card, context) => card.getCost() === this.getHighestCostOfCharactersInPlay(context)
            }, AbilityDsl.actions.removeFate((context) => ({
                amount: 1,
                recipient: context.player
            })))
            .effect('take 1 fate from {0} — evil begone!')
            .phase(Phases.Conflict);
    }

    private getHighestCostOfCharactersInPlay(context: AbilityContext) {
        return context.game
            .findAnyCardsInPlay((card: BaseCard) => card.type === CardType.Character)
            .reduce((prevHighestCost: number, card: DrawCard) => {
                const cost = card.getCost();
                return typeof cost === 'number' && cost > prevHighestCost ? cost : prevHighestCost;
            }, 0);
    }
}
