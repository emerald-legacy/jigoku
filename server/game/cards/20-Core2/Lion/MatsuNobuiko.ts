import { DuelType } from '../../../Constants.js';
import type { Duel } from '../../../Duel.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

export default class MatsuNobuiko extends DrawCard {
    static id = 'matsu-nobuiko';

    setupCardAbilities() {
        this.wouldInterrupt('Initiate a military duel')
            .when({
                onInitiateAbilityEffects: (event, context) =>
                    context.player.opponent &&
                    event.context.ability.abilityType === 'action' &&
                    context.source.isParticipating()
            })
            .initiateDuel((context) => ({
                type: DuelType.Military,
                opponentChoosesDuelTarget: true,
                gameAction: (duel: Duel) =>
                    duel.winner && duel.winningPlayer === context.player ? AbilityDsl.actions.cancel() : AbilityDsl.actions.noAction()
            }));
    }
}
