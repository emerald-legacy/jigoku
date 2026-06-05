import AbilityDsl from '../../abilitydsl.js';
import { BaseOni } from './_BaseOni.js';
import type Player from '../../Player.js';

export default class BogHag extends BaseOni {
    static id = 'bog-hag';

    public setupCardAbilities() {
        super.setupCardAbilities();
        this.reaction({
            title: 'Discard from the conflict deck',
            when: {
                afterConflict: (event, context) =>
                    event.conflict.winner === context.source.controller &&
                    context.source.isParticipating() &&
                    context.player.opponent &&
                    context.player.opponent.conflictDeck.length > 0
            },
            gameAction: AbilityDsl.actions.discardCard((context) => ({
                target: context.player.opponent?.conflictDeck.slice(0, 8) ?? []
            })),
            effect: 'discard the top 8 cards of {1}\'s conflict deck',
            effectArgs: (context) => [context.player.opponent as Player]
        });
    }
}
