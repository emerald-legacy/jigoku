import { msg } from '../../../GameChat.js';
import type { AbilityContext } from '../../../AbilityContext.js';
import { discardCard } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class BayushiRumormonger extends DrawCard {
    static id = 'bayushi-rumormonger';

    public setupCardAbilities() {
        this.conflictAction('Discard cards from opponent\'s conflict deck')
            .condition((context) => Boolean(context.player.opponent))
            .gameAction(discardCard((context) => ({
                target: context.player.opponent?.conflictDeck.slice(0, this.getHighestNumberOfParticipants(context)) ?? []
            })))
            .chatText((context) => {
                const x = this.getHighestNumberOfParticipants(context);
                return msg`discard ${x} card${x === 1 ? '' : 's'} from ${context.player.opponent}'s conflict deck`;
            });
    }

    private getHighestNumberOfParticipants(context: AbilityContext) {
        const conflict = context.game.currentConflict;
        if(!conflict) {
            return 0;
        }
        const opponent = context.player.opponent;
        return Math.max(
            conflict.getNumberOfParticipantsFor(context.player),
            opponent ? conflict.getNumberOfParticipantsFor(opponent) : 0
        );
    }
}
