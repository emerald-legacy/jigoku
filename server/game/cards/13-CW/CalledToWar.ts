import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { placeFate } from '../../GameActions/GameActions.js';
import { Players, CardType } from '../../Constants.js';
import { honorTransferMessage } from '../honorTransferMessage.js';

class CalledToWar extends DrawCard {
    static id = 'called-to-war';

    setupCardAbilities() {
        this.action('Place a fate on a bushi')
            .cost(AbilityDsl.costs.optionalHonorTransferFromOpponentCost())
            .target({
                name: 'myCharacter',
                cardType: CardType.Character,
                cardCondition: card => card.hasTrait('bushi')
            }, placeFate())
            .target({
                name: 'oppCharacter',
                player: Players.Opponent,
                cardType: CardType.Character,
                optional: true,
                hideIfNoLegalTargets: true,
                cardCondition: (card, context) => Boolean(card.hasTrait('bushi') && context.costs.optionalHonorTransferFromOpponentCostPaid)
            }, placeFate())
            .effect('place a fate on {1}{2}', (context) => [
                context.targets.myCharacter,
                honorTransferMessage(context, context.targets.oppCharacter, (name) => 'place a fate on ' + name)
            ]);
    }
}


export default CalledToWar;
