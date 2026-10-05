import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class IdeTrader extends DrawCard {
    static id = 'ide-trader';

    setupCardAbilities() {
        this.reaction('Gain a fate/card')
            .when({
                onMoveToConflict: (_event, context) => context.source.isParticipating()
            })
            .select({}, {
                'Gain 1 fate': AbilityDsl.actions.gainFate(),
                'Draw 1 card': AbilityDsl.actions.draw()
            })
            .limit(AbilityDsl.limit.perConflict(1))
            .collectiveTrigger();
    }
}


export default IdeTrader;
