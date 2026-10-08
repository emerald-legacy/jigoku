import { Duration, Phase } from '../../Constants.js';
import { perRound } from '../../AbilityLimit.js';
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
                    context.source.parentCharacter && event.phase === Phase.Fate && !context.source.parentCharacter.bowed
            })
            .playerLastingEffect({
                duration: Duration.UntilEndOfRound,
                effect: playerDelayedEffect({
                    when: {
                        onPhaseEnded: (event) => event.phase === Phase.Fate
                    },
                    message: '{0} takes hold',
                    messageArgs: (context) => [context.source],
                    gameAction: handler({
                        handler: (context) => context.game.queueStep(new FatePhase(context.game))
                    })
                })
            })
            .chatText('resolve a second fate phase after this')
            .max(perRound(1));
    }
}
