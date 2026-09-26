import type { AbilityContext } from '../../AbilityContext.js';
import { DuelType, Players } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
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
                gameAction: AbilityDsl.actions.playerLastingEffect((context: AbilityContext<DrawCard, DrawCard>) => ({
                    targetController: Players.Any,
                    effect:
                        context.game.currentDuel?.winner?.includes(context.source) ?? false
                            ? AbilityDsl.effects.setConflictTotalSkill(0)
                            : []
                }))
            }));
    }
}
