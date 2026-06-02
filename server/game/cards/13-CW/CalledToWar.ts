import DrawCard from '../../DrawCard.js';
import type Player from '../../Player.js';
import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';
import { Players, CardType } from '../../Constants.js';

class CalledToWar extends DrawCard {
    static id = 'called-to-war';

    setupCardAbilities() {
        this.action({
            title: 'Place a fate on a bushi',
            cost: AbilityDsl.costs.optionalHonorTransferFromOpponentCost(),
            targets: {
                myCharacter: {
                    cardType: CardType.Character,
                    cardCondition: card => card.hasTrait('bushi'),
                    gameAction: AbilityDsl.actions.placeFate()
                },
                oppCharacter: {
                    player: Players.Opponent,
                    cardType: CardType.Character,
                    optional: true,
                    hideIfNoLegalTargets: true,
                    cardCondition: (card, context) => card.hasTrait('bushi') && context.costs.optionalHonorTransferFromOpponentCostPaid,
                    gameAction: AbilityDsl.actions.placeFate()
                }
            },
            effect: 'place a fate on {1}{2}',
            effectArgs: context => [context.targets.myCharacter, this.buildString(context)]
        });
    }

    buildString(context: AbilityContext) {
        if(context.targets.oppCharacter && !Array.isArray(context.targets.oppCharacter)) {
            let target = context.targets.oppCharacter;
            return '.  ' + (context.player.opponent as Player).name + ' gives ' + context.player.name + ' 1 honor to place a fate on ' + target.name;
        }
        return '';
    }
}


export default CalledToWar;
