import { DuelType, Duration, ConflictType } from '../../../Constants.js';
import { changePlayerSkillModifier, modifyDuelSkill } from '../../../effects.js';
import { conditional, duelLastingEffect, noAction, playerLastingEffect } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';

export default class DaidojiAkikore extends DrawCard {
    static id = 'daidoji-akikore';

    setupCardAbilities() {
        this.duelFocus('Add +1 to your duel total', (duel, context) =>
            context.game.isDuringConflict(ConflictType.Political) && duel.participants.includes(context.source))
            .gameAction(duelLastingEffect((context) => ({
                target: context.event.duel,
                effect: modifyDuelSkill({ amount: 1, player: context.player }),
                duration: Duration.UntilEndOfDuel
            })))
            .effect('add 1 to their duel total');

        this.action('Military duel to add skill')
            .initiateDuel((context) => ({
                type: DuelType.Military,
                opponentChoosesDuelTarget: true,
                message: '{0}{1}{2}',
                messageArgs: (duel) =>
                    duel.winningPlayer === context.player
                        ? ['add 3 to ', context.player, '\'s side for this conflict']
                        : ['no effect', '', ''],
                gameAction: (duel) =>
                    conditional({
                        condition: duel.winningPlayer === context.player,
                        trueGameAction: playerLastingEffect({
                            targetController: duel.winningPlayer,
                            effect: changePlayerSkillModifier(3)
                        }),
                        falseGameAction: noAction()
                    })
            }));
    }
}
