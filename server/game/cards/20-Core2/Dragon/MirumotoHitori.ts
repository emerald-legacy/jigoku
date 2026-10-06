import { Location, Duration, Phases } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';
import { delayedEffect } from '../../../effects.js';
import {
    cancel,
    cardLastingEffect,
    putIntoPlay,
    removeFromGame,
    sequential
} from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class MirumotoHitori extends DrawCard {
    static id = 'mirumoto-hitori';

    public setupCardAbilities() {
        this.interrupt('A new incarnation awaits')
            .when({
                onCardLeavesPlay: (event, context) =>
                    event.card === context.source && context.game.currentPhase === Phases.Fate
            })
            .cost(AbilityDsl.costs.returnRings(1))
            .gameAction(cancel((context) => ({
                target: context.source,
                replacementGameAction: sequential([
                    removeFromGame(),
                    cardLastingEffect({
                        target: context.source,
                        canChangeZoneOnce: true,
                        duration: Duration.Custom,
                        until: {
                            onCharacterEntersPlay: (event) => event.card === context.source,
                            onPhaseEnded: (event) => event.phase === Phases.Dynasty
                        },
                        effect: delayedEffect({
                            when: {
                                onPhaseStarted: (event) => event.phase === Phases.Dynasty
                            },
                            message: '{0} is put into play due to {0}\'s effect',
                            messageArgs: [context.source],
                            gameAction: putIntoPlay((context) => ({
                                location: Location.Any,
                                target: context.source
                            }))
                        })
                    })
                ])
            })))
            .effect('remove {1} from play, to be put back into play next round', (context) => context.source);
    }
}
