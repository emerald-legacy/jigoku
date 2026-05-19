import DrawCard from '../../drawcard.js';
import AbilityDsl from '../../abilitydsl.js';
import { Stages } from '../../Constants.js';

class Duty extends DrawCard {
    static id = 'duty';

    setupCardAbilities() {
        this.wouldInterrupt({
            title: 'Cancel honor loss',
            when: {
                onModifyHonor: (event, context) =>
                    event.player === context.player && -event.amount >= context.player.honor && event.context.stage === Stages.Effect,
                onTransferHonor: (event, context) =>
                    event.player === context.player && event.amount >= context.player.honor && event.context.stage === Stages.Effect
            },
            cannotBeMirrored: true,
            effect: 'cancel their honor loss, then gain 1 honor',
            gameAction: AbilityDsl.actions.sequential([
                AbilityDsl.actions.cancel(),
                AbilityDsl.actions.gainHonor(context => ({ target: context.player }))
            ])
        });
    }
}


export default Duty;
