import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { Players } from '../../Constants.js';
import { resolveRingEffect, selectRing } from '../../GameActions/GameActions.js';

class GarantoGuardian extends DrawCard {
    static id = 'garanto-guardian';

    setupCardAbilities() {
        this.reaction('Resolve a ring effect')
            .when({
                afterConflict: (event, context) => context.player.isDefendingPlayer() && event.conflict.winner === context.source.controller && context.source.isParticipating()
            })
            .gameAction(selectRing((context) => ({
                activePromptTitle: 'Choose a ring effect to resolve',
                player: Players.Self,
                targets: true,
                message: (context, ring) => msg`${context.player} chooses to resolve ${ring}'s effect`,
                ringCondition: (ring) => this.game.currentConflict?.getConflictProvinces().some((a) => a.element.includes(ring.element)) ?? false,
                gameAction: resolveRingEffect({ player: context.player })
            })))
            .chatText('resolve a ring effect');
    }
}


export default GarantoGuardian;

