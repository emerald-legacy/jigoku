import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { removeFate } from '../../GameActions/GameActions.js';
import { Players, CardType } from '../../Constants.js';
import { honorTransferMessage } from '../honorTransferMessage.js';

class CriminalContacts extends DrawCard {
    static id = 'criminal-contacts';

    setupCardAbilities() {
        this.action('Discard a fate from a character')
            .cost(costs.optionalTakeHonorFromOpponent())
            .condition(context => !!(context.player.opponent && context.player.showBid > context.player.opponent.showBid))
            .target({
                name: 'myCharacter',
                cardType: CardType.Character
            }, removeFate())
            .target({
                name: 'oppCharacter',
                player: Players.Opponent,
                cardType: CardType.Character,
                optional: true,
                hideIfNoLegalTargets: true,
                cardCondition: (_card, context) => Boolean(context.costs.honorTakenFromOpponent)
            }, removeFate())
            .chatText('discard a fate from {1}{2}', (context) => [
                context.targets.myCharacter,
                honorTransferMessage(context, context.targets.oppCharacter, (name) => 'discard a fate from ' + name)
            ]);
    }
}


export default CriminalContacts;
