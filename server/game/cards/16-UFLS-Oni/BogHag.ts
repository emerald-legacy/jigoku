import { discardCard } from '../../GameActions/GameActions.js';
import { BaseOni } from './_BaseOni.js';
import { msg } from '../../GameChat.js';

export default class BogHag extends BaseOni {
    static id = 'bog-hag';

    public setupCardAbilities() {
        super.setupCardAbilities();
        this.reaction('Discard from the conflict deck')
            .when({
                afterConflict: (event, context) =>
                    event.conflict.winner === context.source.controller &&
                    context.source.isParticipating() &&
                    context.player.opponent &&
                    context.player.opponent.conflictDeck.length > 0
            })
            .gameAction(discardCard((context) => ({
                target: context.player.opponent?.conflictDeck.slice(0, 8) ?? []
            })))
            .chatText((context) => msg`discard the top 8 cards of ${context.player.opponent}'s conflict deck`);
    }
}
