import DrawCard from '../../DrawCard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Stage } from '../../Constants.js';

class Duty extends DrawCard {
    static id = 'duty';

    setupCardAbilities() {
        this.wouldInterrupt('Cancel honor loss')
            .when({
                onModifyHonor: (event, context) =>
                    event.player === context.player && -(event.amount ?? 0) >= context.player.honor && event.context?.stage === Stage.Effect,
                onTransferHonor: (event, context) =>
                    event.player === context.player && (event.amount ?? 0) >= context.player.honor && event.context?.stage === Stage.Effect
            })
            .gameAction(AbilityDsl.actions.sequential([
                AbilityDsl.actions.cancel(),
                AbilityDsl.actions.gainHonor((context) => ({ target: context.player }))
            ]))
            .effect('cancel their honor loss, then gain 1 honor')
            .cannotBeMirrored();
    }
}


export default Duty;
