import { Duration, Phases } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import { playerDelayedEffect } from '../../effects.js';
import { handler } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { FatePhase } from '../../gamesteps/FatePhase.js';

export default class JurojinsCurse extends DrawCard {
    static id = 'jurojin-s-curse';

    setupCardAbilities() {
        this.forcedInterrupt('Resolve a second fate phase')
            .when({
                onPhaseEnded: (event, context) =>
                    context.source.parentCharacter && event.phase === Phases.Fate && !context.source.parentCharacter.bowed
            })
            .playerLastingEffect({
                duration: Duration.UntilEndOfRound,
                effect: playerDelayedEffect({
                    when: {
                        onPhaseEnded: (event) => event.phase === Phases.Fate
                    },
                    message: '{0} takes hold',
                    messageArgs: (context) => [context.source],
                    gameAction: handler({
                        handler: (context) => context.game.queueStep(new FatePhase(context.game))
                    })
                })
            })
            .effect('resolve a second fate phase after this')
            .max(AbilityDsl.limit.perRound(1));
    }
}
