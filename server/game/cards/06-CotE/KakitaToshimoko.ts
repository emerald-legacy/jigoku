import { msg } from '../../GameChat.js';
import { DuelType, Players } from '../../Constants.js';
import { setConflictTotalSkill } from '../../effects.js';
import { noAction, playerLastingEffect } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class KakitaToshimoko extends DrawCard {
    static id = 'kakita-toshimoko';

    override setupCardAbilities() {
        this.wouldInterrupt('Initiate a military duel')
            .when({
                afterConflict: (event, context) =>
                    context.source.isParticipating() && event.conflict.loser === context.player
            })
            .initiateDuel((context) => ({
                type: DuelType.Military,
                opponentChoosesDuelTarget: true,
                chatText: () => msg`both players count 0 total skill for the conflict`,
                gameAction: (duel) => duel.winner.includes(context.source)
                    ? playerLastingEffect({ target: Players.Any, effect: setConflictTotalSkill(0) })
                    : noAction()
            }));
    }
}
