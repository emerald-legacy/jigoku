import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Stages } from '../../Constants.js';

class ShiotomeHeroine extends DrawCard {
    static id = 'shiotome-heroine';

    setupCardAbilities() {
        this.reaction({
            title: 'Ready this character',
            when: {
                onModifyHonor: (event: any, context: any) =>
                    (event.amount ?? 0) > 0 && context.player.opponent &&
                    event.player === context.player.opponent && event.context?.stage === Stages.Effect
            },
            gameAction: AbilityDsl.actions.ready()
        });
    }
}


export default ShiotomeHeroine;
