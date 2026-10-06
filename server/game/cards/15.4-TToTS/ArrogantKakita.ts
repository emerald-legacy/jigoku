import { DuelType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import { sendHome } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';

export default class ArrogantKakita extends DrawCard {
    static id = 'arrogant-kakita';

    setupCardAbilities() {
        this.forcedReaction('Initiate a military duel')
            .when({
                onDefendersDeclared: (_event, context) => context.source.isParticipating()
            })
            .initiateDuel((context) => ({
                type: DuelType.Military,
                gameAction: (duel) => sendHome({
                    target: duel.loser?.includes(context.source) ? context.source : []
                })
            }))
            .limit(AbilityDsl.limit.unlimited());
    }
}
