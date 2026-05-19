import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { DuelTypes } from '../../Constants.js';

class LoyalChallenger extends DrawCard {
    static id = 'loyal-challenger';

    setupCardAbilities() {
        this.persistentEffect({
            effect: [
                AbilityDsl.effects.delayedEffect({
                    when: {
                        afterConflict: (event, context) => event.conflict.winner === context.source.controller &&
                            context.source.isParticipating()
                    },
                    message: '{0} gains 1 honor due to {1} winning a conflict',
                    messageArgs: context => [context.player, context.source],
                    gameAction: AbilityDsl.actions.gainHonor(context => ({ target: context.player }))
                })
                ,
                AbilityDsl.effects.delayedEffect({
                    when: {
                        afterConflict: (event, context) => event.conflict.loser === context.source.controller &&
                            context.source.isParticipating()
                    },
                    message: '{0} loses 1 honor due to {1} losing a conflict',
                    messageArgs: context => [context.player, context.source],
                    gameAction: AbilityDsl.actions.loseHonor(context => ({ target: context.player }))
                })
            ]
        });
        this.action({
            title: 'Initiate a Political duel',
            initiateDuel: {
                type: DuelTypes.Political,
                message: '{0} is blanked until the end of the conflict',
                messageArgs: duel => duel.loser,
                gameAction: duel => AbilityDsl.actions.cardLastingEffect({
                    target: duel.loser,
                    effect: AbilityDsl.effects.blank()
                })
            }
        });
    }
}


export default LoyalChallenger;
