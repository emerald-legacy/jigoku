import { CardType, Duration, Phases, Players } from '../../../Constants.js';
import { delayedEffect } from '../../../effects.js';
import { cardLastingEffect, moveToConflict, multiple, ready } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class IkomaMasterHunter extends DrawCard {
    static id = 'ikoma-master-hunter';

    public setupCardAbilities() {
        this.reaction('move in and ready when target joins')
            .when({
                onPhaseStarted: (event) => event.phase === Phases.Conflict
            })
            .target({
                controller: Players.Opponent,
                cardType: CardType.Character
            }, cardLastingEffect((context) => ({
                duration: Duration.UntilEndOfPhase,
                target: context.source,
                effect: delayedEffect({
                    when: {
                        onMoveToConflict: (event) => event.card === context.target,
                        onDefendersDeclared: (event) =>
                            event.conflict.getParticipants().includes(context.target),
                        onConflictDeclared: (event) =>
                            event.conflict.getParticipants().includes(context.target)
                    },
                    multipleTrigger: true,
                    gameAction: multiple([
                        moveToConflict({
                            target: context.source
                        }),
                        ready({
                            target: context.source
                        })
                    ])
                })
            })))
            .effect('track {0}');
    }
}
