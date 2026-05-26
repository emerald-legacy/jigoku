import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { CardTypes, DuelTypes, EventNames } from '../../Constants.js';

import type { EventPayload } from '../../Events/EventPayloads.js';
class DefendYourHonor extends DrawCard {
    static id = 'defend-your-honor';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Initiate a military duel',
            when: {
                onInitiateAbilityEffects: (event: EventPayload<EventNames.OnInitiateAbilityEffects>, context: any) =>
                    context.game.isDuringConflict() && context.player.opponent &&
                    event.card.type === CardTypes.Event && event.context.player === context.player.opponent
            },
            initiateDuel: (context: any) => ({
                type: DuelTypes.Military,
                opponentChoosesDuelTarget: true,
                gameAction: (duel: any) => (duel.winner && duel.winningPlayer === context.player) ? AbilityDsl.actions.cancel() : AbilityDsl.actions.noAction()
            })
        });
    }
}


export default DefendYourHonor;
