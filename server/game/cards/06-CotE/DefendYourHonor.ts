import DrawCard from '../../DrawCard.js';
import type { AbilityContext } from '../../AbilityContext.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardType, DuelType, EventName } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
import type { TriggeredAbilityContext } from '../../TriggeredAbilityContext.js';
import type { Duel } from '../../Duel.js';
class DefendYourHonor extends DrawCard {
    static id = 'defend-your-honor';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Initiate a military duel',
            when: {
                onInitiateAbilityEffects: (event: EventPayload<EventName.OnInitiateAbilityEffects>, context: TriggeredAbilityContext) =>
                    context.game.isDuringConflict() && context.player.opponent &&
                    event.card.type === CardType.Event && event.context.player === context.player.opponent
            },
            initiateDuel: (context: AbilityContext) => ({
                type: DuelType.Military,
                opponentChoosesDuelTarget: true,
                gameAction: (duel: Duel) => (duel.winner && duel.winningPlayer === context.player) ? AbilityDsl.actions.cancel() : AbilityDsl.actions.noAction()
            })
        });
    }
}


export default DefendYourHonor;
