import type { AbilityContext } from '../../AbilityContext.js';
import { DuelType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';

export default class ArrogantKakita extends DrawCard {
    static id = 'arrogant-kakita';

    setupCardAbilities() {
        this.forcedReaction({
            title: 'Initiate a political duel',
            when: {
                onDefendersDeclared: (event, context) => context.source.isParticipating()
            },
            initiateDuel: {
                type: DuelType.Military,
                gameAction: (duel) =>
                    AbilityDsl.actions.sendHome((context: AbilityContext<DrawCard, DrawCard>) => ({
                        target: duel.loser?.includes(context.source) ? context.source : []
                    }))
            },
            limit: AbilityDsl.limit.perRound(Infinity)
        });
    }
}
