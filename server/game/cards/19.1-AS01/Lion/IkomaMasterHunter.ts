import { CardType, Duration, Phases, Players } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
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
            }, AbilityDsl.actions.cardLastingEffect((context) => ({
                duration: Duration.UntilEndOfPhase,
                target: context.source,
                effect: AbilityDsl.effects.delayedEffect({
                    when: {
                        onMoveToConflict: (event) => event.card === context.target,
                        onDefendersDeclared: (event) =>
                            event.conflict.getParticipants().includes(context.target),
                        onConflictDeclared: (event) =>
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
            })))
            .effect('track {0}');
    }
}
