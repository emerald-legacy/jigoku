import type { AbilityContext } from '../../AbilityContext.js';
import { DuelTypes } from '../../Constants.js';
import type { Duel } from '../../Duel.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../drawcard.js';

export default class CourtlyChallenger extends DrawCard {
    static id = 'courtly-challenger';

    setupCardAbilities() {
        this.persistentEffect({
            effect: [
                AbilityDsl.effects.delayedEffect({
                    when: {
                        afterDuel: (event: Duel, context: AbilityContext) =>
                            event.winner?.includes(context.source) ?? false
                    },
                    message: '{0} is honored due to winning a duel',
                    messageArgs: (context: AbilityContext) => [context.source],
                    gameAction: AbilityDsl.actions.honor()
                }),
                AbilityDsl.effects.delayedEffect({
                    when: {
                        afterDuel: (event: Duel, context: AbilityContext) =>
                            event.loser?.includes(context.source) ?? false
                    },
                    message: '{0} is dishonored due to losing a duel',
                    messageArgs: (context: AbilityContext) => [context.source],
                    gameAction: AbilityDsl.actions.dishonor()
                })
            ]
        });

        this.action({
            title: 'Initiate a Political duel',
            initiateDuel: {
                type: DuelTypes.Political,
                gameAction: (duel) => AbilityDsl.actions.draw({ amount: 2, target: duel.winnerController })
            }
        });
    }
}
