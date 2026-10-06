import { DuelType, Players } from '../../Constants.js';
import { setConflictTotalSkill } from '../../effects.js';
import { playerLastingEffect } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class KakitaToshimoko extends DrawCard {
    static id = 'kakita-toshimoko';

    setupCardAbilities() {
        this.wouldInterrupt('Initiate a military duel')
            .when({
                afterConflict: (event, context) =>
                    context.source.isParticipating() && event.conflict.loser === context.player
            })
            .initiateDuel(() => ({
                type: DuelType.Military,
                opponentChoosesDuelTarget: true,
                message: 'both players count 0 total skill for the conflict',
                gameAction: playerLastingEffect((context) => ({
                    targetController: Players.Any,
                    effect:
                        context.game.currentDuel?.winner?.some((card) => card === context.source) ?? false
                            ? setConflictTotalSkill(0)
                            : []
                }))
            }));
    }
}
