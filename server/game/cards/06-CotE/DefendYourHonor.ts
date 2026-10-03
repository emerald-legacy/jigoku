import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, DuelType } from '../../Constants.js';

import type { Duel } from '../../Duel.js';
class DefendYourHonor extends DrawCard {
    static id = 'defend-your-honor';

    setupCardAbilities() {
        this.wouldInterrupt('Initiate a military duel')
            .when({
                onInitiateAbilityEffects: (event, context) =>
                    context.game.isDuringConflict() && context.player.opponent &&
                    event.card.type === CardType.Event && event.context.player === context.player.opponent
            })
            .initiateDuel((context) => ({
                type: DuelType.Military,
                opponentChoosesDuelTarget: true,
                gameAction: (duel: Duel) => (duel.winner && duel.winningPlayer === context.player) ? AbilityDsl.actions.cancel() : AbilityDsl.actions.noAction()
            }));
    }
}


export default DefendYourHonor;
