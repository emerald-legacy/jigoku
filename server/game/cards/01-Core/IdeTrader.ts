import DrawCard from '../../DrawCard.js';
import { TargetMode } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class IdeTrader extends DrawCard {
    static id = 'ide-trader';

    setupCardAbilities(ability: typeof AbilityDsl) {
        this.reaction({
            title: 'Gain a fate/card',
            when: {
                onMoveToConflict: (event, context) => context.source.isParticipating()
            },
            collectiveTrigger: true,
            limit: ability.limit.perConflict(1),
            target: {
                mode: TargetMode.Select,
                choices: {
                    'Gain 1 fate': ability.actions.gainFate(),
                    'Draw 1 card': ability.actions.draw()
                }
            }
        });
    }
}


export default IdeTrader;
