import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { discardCard } from '../../GameActions/GameActions.js';
import { msg } from '../../GameChat.js';

class LicensedQuarter extends DrawCard {
    static id = 'licensed-quarter';

    setupCardAbilities() {
        this.reaction('Discard the top card of your opponents conflict deck')
            .when({
                afterConflict: (event, context) => event.conflict.winner === context.player
            })
            .gameAction(discardCard(context => ({
                target: context.player.opponent && context.player.opponent.conflictDeck[0]
            })))
            .effect((context) => msg`discard the top card of ${context.player.opponent}'s conflict deck`)
            .limit(AbilityDsl.limit.unlimitedPerConflict());
    }
}


export default LicensedQuarter;

