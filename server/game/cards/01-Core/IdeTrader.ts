import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';

class IdeTrader extends DrawCard {
    static id = 'ide-trader';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction('Gain a fate/card')
            .when({
                onMoveToConflict: (event, context) => context.source.isParticipating()
            })
            .select('target', {

            }, {
                'Gain 1 fate': ability.actions.gainFate(),
                'Draw 1 card': ability.actions.draw()
            })
            .limit(ability.limit.perConflict(1))
            .collectiveTrigger();
    }
}


export default IdeTrader;
