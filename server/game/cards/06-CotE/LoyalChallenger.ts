import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { blank, delayedEffect } from '../../effects.js';
import { cardLastingEffect, gainHonor, loseHonor } from '../../GameActions/GameActions.js';
import { DuelType } from '../../Constants.js';

class LoyalChallenger extends DrawCard {
    static id = 'loyal-challenger';

    setupCardAbilities() {
        this.persistentEffect({
            effect: [
                delayedEffect({
                    when: {
                        afterConflict: (event, context) => event.conflict.winner === context.source.controller &&
                            context.source.isDrawCard() && context.source.isParticipating()
                    },
                    message: (context) => msg`${context.player} gains 1 honor due to ${context.source} winning a conflict`,
                    gameAction: gainHonor((context) => ({ target: context.player }))
                }),
                delayedEffect({
                    when: {
                        afterConflict: (event, context) => event.conflict.loser === context.source.controller &&
                            context.source.isDrawCard() && context.source.isParticipating()
                    },
                    message: (context) => msg`${context.player} loses 1 honor due to ${context.source} losing a conflict`,
                    gameAction: loseHonor((context) => ({ target: context.player }))
                })
            ]
        });
        this.action('Initiate a Political duel')
            .initiateDuel(() => ({
                type: DuelType.Political,
                message: '{0} is blanked until the end of the conflict',
                messageArgs: (duel) => duel.loser,
                gameAction: (duel) => cardLastingEffect({
                    target: duel.loser,
                    effect: blank()
                })
            }));
    }
}


export default LoyalChallenger;
