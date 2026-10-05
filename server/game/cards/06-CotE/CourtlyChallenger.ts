import { DuelType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

export default class CourtlyChallenger extends DrawCard {
    static id = 'courtly-challenger';

    setupCardAbilities() {
        this.persistentEffect({
            effect: [
                AbilityDsl.effects.delayedEffect({
                    when: {
                        afterDuel: (event, context) => event.winner?.some((card) => card === context.source) ?? false
                    },
                    message: '{0} is honored due to winning a duel',
                    messageArgs: (context) => [context.source],
                    gameAction: AbilityDsl.actions.honor()
                }),
                AbilityDsl.effects.delayedEffect({
                    when: {
                        afterDuel: (event, context) => event.loser?.some((card) => card === context.source) ?? false
                    },
                    message: '{0} is dishonored due to losing a duel',
                    messageArgs: (context) => [context.source],
                    gameAction: AbilityDsl.actions.dishonor()
                })
            ]
        });

        this.action('Initiate a Political duel')
            .initiateDuel(() => ({
                type: DuelType.Political,
                gameAction: (duel) => AbilityDsl.actions.draw({ amount: 2, target: duel.winnerController })
            }));
    }
}
