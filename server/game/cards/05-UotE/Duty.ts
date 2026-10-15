import DrawCard from '../../DrawCard.js';
import { cancel, gainHonor, sequential } from '../../GameActions/GameActions.js';
import { Stage } from '../../Constants.js';

class Duty extends DrawCard {
    static id = 'duty';

    setupCardAbilities() {
        this.wouldInterrupt('Cancel honor loss')
            .when({
                onModifyHonor: (event, context) =>
                    event.player === context.player && -event.amount >= context.player.honor && event.context?.stage === Stage.Effect,
                onTransferHonor: (event, context) =>
                    event.player === context.player && event.amount >= context.player.honor && event.context?.stage === Stage.Effect
            })
            .gameAction(sequential([
                cancel(),
                gainHonor((context) => ({ target: context.player }))
            ]))
            .chatText('cancel their honor loss, then gain 1 honor')
            .cannotBeMirrored();
    }
}


export default Duty;
