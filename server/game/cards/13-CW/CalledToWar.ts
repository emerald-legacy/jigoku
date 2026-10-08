import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { placeFate } from '../../GameActions/GameActions.js';
import { Players, CardType } from '../../Constants.js';
import { honorTransferMessage } from '../honorTransferMessage.js';

class CalledToWar extends DrawCard {
    static id = 'called-to-war';

    setupCardAbilities() {
        this.action('Place a fate on a bushi')
            .cost(costs.optionalTakeHonorFromOpponent())
            .target({
                name: 'myCharacter',
                cardType: CardType.Character,
                cardCondition: (card) => card.hasTrait('bushi')
            }, placeFate())
            .target({
                name: 'oppCharacter',
                player: Players.Opponent,
                cardType: CardType.Character,
                optional: true,
                hideIfNoLegalTargets: true,
                cardCondition: (card, context) => Boolean(card.hasTrait('bushi') && context.costs.honorTakenFromOpponent)
            }, placeFate())
            .chatText((context) => msg`place a fate on ${context.targets.myCharacter}${honorTransferMessage(context, context.targets.oppCharacter, (name) => 'place a fate on ' + name)}`);
    }
}


export default CalledToWar;
