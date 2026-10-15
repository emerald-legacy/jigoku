import { msg } from '../../GameChat.js';
import { DuelType } from '../../Constants.js';
import { delayedEffect } from '../../effects.js';
import { dishonor, draw, honor } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class CourtlyChallenger extends DrawCard {
    static id = 'courtly-challenger';

    setupCardAbilities() {
        this.persistentEffect({
            effect: [
                delayedEffect({
                    when: {
                        afterDuel: (event, context) => event.winner?.some((card) => card === context.source) ?? false
                    },
                    message: (context) => msg`${context.source} is honored due to winning a duel`,
                    gameAction: honor()
                }),
                delayedEffect({
                    when: {
                        afterDuel: (event, context) => event.loser?.some((card) => card === context.source) ?? false
                    },
                    message: (context) => msg`${context.source} is dishonored due to losing a duel`,
                    gameAction: dishonor()
                })
            ]
        });

        this.action('Initiate a Political duel')
            .initiateDuel(() => ({
                type: DuelType.Political,
                gameAction: (duel) => draw({ amount: 2, target: duel.winnerController })
            }));
    }
}
