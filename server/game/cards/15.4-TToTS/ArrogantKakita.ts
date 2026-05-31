import { DuelTypes } from '../../Constants.js';
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
                type: DuelTypes.Military,
                gameAction: (duel) =>
                    AbilityDsl.actions.sendHome((context) => ({
                        target: duel.loser?.includes(context.source) ? context.source : []
                    }))
            },
            limit: AbilityDsl.limit.perRound(Infinity)
        });
    }
}
