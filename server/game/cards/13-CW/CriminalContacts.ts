import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import * as costs from '../../costs/index.js';
import { removeFate } from '../../GameActions/GameActions.js';
import { Players, CardType } from '../../Constants.js';
import { honorTransferMessage } from '../honorTransferMessage.js';

class CriminalContacts extends DrawCard {
    static id = 'criminal-contacts';

    override setupCardAbilities() {
        this.action('Discard a fate from a character')
            .playOnlyIf((context) => !!(context.player.opponent && context.player.showBid > context.player.opponent.showBid))
            .cost(costs.optionalTakeHonorFromOpponent())
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
            .chatText((context) => msg`discard a fate from ${context.targets.myCharacter}${honorTransferMessage(context, context.targets.oppCharacter, (card) => msg`discard a fate from ${card}`)}`);
    }
}


export default CriminalContacts;
