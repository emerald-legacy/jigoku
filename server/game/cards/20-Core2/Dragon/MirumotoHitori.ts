import { Location, Duration, Phases, EventName } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';
import type { EventPayload } from '../../../Events/EventPayloads.js';

export default class MirumotoHitori extends DrawCard {
    static id = 'mirumoto-hitori';

    public setupCardAbilities() {
        this.interrupt({
            title: 'A new incarnation awaits',
            when: {
                onCardLeavesPlay: (event, context) =>
                    event.card === context.source && context.game.currentPhase === Phases.Fate
            },
            cost: AbilityDsl.costs.returnRings(1),
            gameAction: AbilityDsl.actions.cancel((context) => ({
                target: context.source,
                replacementGameAction: AbilityDsl.actions.sequential([
                    AbilityDsl.actions.removeFromGame(),
                    AbilityDsl.actions.cardLastingEffect({
                        target: context.source,
                        canChangeZoneOnce: true,
                        duration: Duration.Custom,
                        until: {
                            onCharacterEntersPlay: (event) => event.card === context.source,
                            onPhaseEnded: (event) => event.phase === Phases.Dynasty
                        },
                        effect: AbilityDsl.effects.delayedEffect({
                            when: {
                                onPhaseStarted: (event: EventPayload<EventName.OnPhaseStarted>) => event.phase === Phases.Dynasty
                            },
                            message: '{0} is put into play due to {0}\'s effect',
                            messageArgs: [context.source],
                            gameAction: AbilityDsl.actions.putIntoPlay((context) => ({
                                location: Location.Any,
                                target: context.source
                            }))
                        })
                    })
                ])
            })),
            effect: 'remove {1} from play, to be put back into play next round',
            effectArgs: (context) => context.source
        });
    }
}
