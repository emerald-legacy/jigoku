import { AbilityType, DuelType } from '../../../Constants.js';
import { cancel, noAction } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class MatsuNobuiko extends DrawCard {
    static id = 'matsu-nobuiko';

    setupCardAbilities() {
        this.wouldInterrupt('Initiate a military duel')
            .when({
                onInitiateAbilityEffects: (event, context) =>
                    context.player.opponent &&
                    event.context.ability.abilityType === AbilityType.Action &&
                    context.source.isParticipating()
            })
            .initiateDuel((context) => ({
                type: DuelType.Military,
                opponentChoosesDuelTarget: true,
                gameAction: (duel) =>
                    duel.winner && duel.winningPlayer === context.player ? cancel() : noAction()
            }));
    }
}
