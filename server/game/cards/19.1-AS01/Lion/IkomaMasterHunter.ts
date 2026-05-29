import { CardTypes, Durations, EventNames, Phases, Players, TargetModes } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

import type { EventPayload } from '../../../Events/EventPayloads.js';
export default class IkomaMasterHunter extends DrawCard {
    static id = 'ikoma-master-hunter';

    public setupCardAbilities() {
        this.reaction({
            title: 'move in and ready when target joins',
            when: {
                onPhaseStarted: (event) => event.phase === Phases.Conflict
            },
            target: {
                mode: TargetModes.Single,
                controller: Players.Opponent,
                cardType: CardTypes.Character,
                gameAction: AbilityDsl.actions.cardLastingEffect((context) => ({
                    duration: Durations.UntilEndOfPhase,
                    target: context.source,
                    effect: AbilityDsl.effects.delayedEffect({
                        when: {
                            onMoveToConflict: (event: EventPayload<EventNames.OnMoveToConflict>) => event.card === context.target,
                            onDefendersDeclared: (event: EventPayload<EventNames.OnDefendersDeclared>) =>
                                event.conflict.getParticipants().includes(context.target),
                            onConflictDeclared: (event: EventPayload<EventNames.OnConflictDeclared>) =>
                                event.conflict.getParticipants().includes(context.target)
                        },
                        multipleTrigger: true,
                        gameAction: AbilityDsl.actions.multiple([
                            AbilityDsl.actions.moveToConflict({
                                target: context.source
                            }),
                            AbilityDsl.actions.ready({
                                target: context.source
                            })
                        ])
                    })
                }))
            },
            effect: 'track {0}'
        });
    }
}
