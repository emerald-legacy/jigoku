import { delayedEffect } from '../../../effects.js';
import { cardLastingEffect, discardFromPlay, dishonor, honor, multiple } from '../../../GameActions/GameActions.js';
import { CardType, Duration } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class FieldsOfRollingThunder extends DrawCard {
    static id = 'fields-of-rolling-thunder';

    public setupCardAbilities() {
        this.forcedReaction('Discard this holding')
            .when({
                afterConflict: (event, context) =>
                    event.conflict.loser === context.player && event.conflict.conflictUnopposed
            })
            .gameAction(discardFromPlay());

        this.action('Honor a character')
            .target({
                cardType: CardType.Character,
                cardCondition: (card) => card.isParticipating() && card.isFaction('unicorn')
            }, multiple([
                honor(),
                cardLastingEffect((context) => {
                    const conflictWhenItWasTriggered = this.game.currentConflict;
                    return {
                        duration: Duration.UntilEndOfPhase,
                        effect: delayedEffect({
                            when: {
                                onConflictFinished: (event, context) =>
                                    event.conflict === conflictWhenItWasTriggered &&
                                        event.conflict.winner === context.player.opponent
                            },
                            gameAction: dishonor({ target: context.target })
                        })
                    };
                })
            ]))
            .effect('honor {0}. They will be dishonored at the end of the conflict if {1} loses the conflict', (context) => [context.source.controller]);
    }
}
