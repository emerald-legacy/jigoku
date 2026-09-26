import type { AbilityContext } from '../../AbilityContext.js';
import { DuelType, EventName } from '../../Constants.js';
import type { EventPayload } from '../../Events/EventPayloads.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

export default class CourtlyChallenger extends DrawCard {
    static id = 'courtly-challenger';

    setupCardAbilities() {
        this.persistentEffect({
            effect: [
                AbilityDsl.effects.delayedEffect({
                    when: {
                        afterDuel: (event: EventPayload<EventName.AfterDuel>, context: AbilityContext<this>) =>
                            event.winner?.includes(context.source) ?? false
                    },
                    message: '{0} is honored due to winning a duel',
                    messageArgs: (context: AbilityContext) => [context.source],
                    gameAction: AbilityDsl.actions.honor()
                }),
                AbilityDsl.effects.delayedEffect({
                    when: {
                        afterDuel: (event: EventPayload<EventName.AfterDuel>, context: AbilityContext<this>) =>
                            event.loser?.includes(context.source) ?? false
                    },
                    message: '{0} is dishonored due to losing a duel',
                    messageArgs: (context: AbilityContext) => [context.source],
                    gameAction: AbilityDsl.actions.dishonor()
                })
            ]
        });

        this.action('Initiate a Political duel')
            .initiateDuel(() => ({
                type: DuelType.Political,
                gameAction: (duel) => AbilityDsl.actions.draw({ amount: 2, target: duel.winnerController })
            }));
    }
}
