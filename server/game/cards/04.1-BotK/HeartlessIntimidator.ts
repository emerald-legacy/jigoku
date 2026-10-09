import { msg } from '../../GameChat.js';
import { unlimited } from '../../AbilityLimit.js';
import { discardCard } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

class HeartlessIntimidator extends DrawCard {
    static id = 'heartless-intimidator';

    setupCardAbilities() {
        this.reaction('Force opponent to discard 1 card')
            .when({
                onModifyHonor: (event, context) => event.player === context.player.opponent && event.amount < 0,
                onTransferHonor: (event, context) => event.player === context.player.opponent && event.amount > 0
            })
            .gameAction(discardCard((context) => ({
                target: context.player.opponent ? context.player.opponent.conflictDeck[0] : []
            })))
            .chatText((context) => msg`discard the top card of ${context.player.opponent ?? context.player}'s conflict deck`)
            .limit(unlimited());
    }
}


export default HeartlessIntimidator;
