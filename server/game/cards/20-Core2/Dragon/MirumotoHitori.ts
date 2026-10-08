import { Location, Duration, Phase } from '../../../Constants.js';
import * as costs from '../../../costs/index.js';
import { delayedEffect } from '../../../effects.js';
import { cardLastingEffect, putIntoPlay, removeFromGame, sequential } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class MirumotoHitori extends DrawCard {
    static id = 'mirumoto-hitori';

    public setupCardAbilities() {
        this.interrupt('A new incarnation awaits')
            .when({
                onCardLeavesPlay: (event, context) =>
                    event.card === context.source && context.game.currentPhase === Phase.Fate
            })
            .cost(costs.returnRings(1))
            .cancel((context) => ({
                target: context.source,
                replacementGameAction: sequential([
                    removeFromGame(),
                    cardLastingEffect({
                        target: context.source,
                        canChangeZoneOnce: true,
                        duration: Duration.Custom,
                        until: {
                            onCharacterEntersPlay: (event) => event.card === context.source,
                            onPhaseEnded: (event) => event.phase === Phase.Dynasty
                        },
                        effect: delayedEffect({
                            when: {
                                onPhaseStarted: (event) => event.phase === Phase.Dynasty
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
            }))
            .chatText('remove {1} from play, to be put back into play next round', (context) => context.source);
    }
}
