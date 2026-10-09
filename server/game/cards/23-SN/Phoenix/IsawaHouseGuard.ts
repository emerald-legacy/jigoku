import { msg } from '../../../GameChat.js';
import { DuelType, Duration } from '../../../Constants.js';
import { modifyDuelSkill } from '../../../effects.js';
import { dishonor, duelLastingEffect, injure, multipleContext } from '../../../GameActions/GameActions.js';
import DrawCard from '../../../DrawCard.js';
import type { GameAction } from '../../../GameActions/GameAction.js';

export default class IsawaHouseGuard extends DrawCard {
    static id = 'isawa-house-guard';

    public setupCardAbilities() {
        this.duelFocus('Help a character with a duel', (duel, context) => duel.participants.includes(context.source) && context.source.isHonored)
            .gameAction(duelLastingEffect((context) => ({
                target: context.event.duel,
                effect: modifyDuelSkill({ amount: 1, player: context.player }),
                duration: Duration.UntilEndOfDuel
            })))
            .chatText('add 1 to their duel total');

        this.conflictAction('Initiate a military duel to dishonor')
            .initiateDuel(() => ({
                type: DuelType.Military,
                gameAction: (duel) => multipleContext(() => {
                    const gameActions: GameAction[] = [];

                    gameActions.push(dishonor({
                        target: duel.loser
                    }));
                    duel.loser?.forEach((card) => {
                        if(card.isTainted) {
                            gameActions.push(injure({
                                target: card
                            }));
                        }
                    });
                    return { gameActions };
                }),
                chatText: (_context, duel) => msg`${duel.loser} is dishonored and injured if tainted`
            }));
    }
}
