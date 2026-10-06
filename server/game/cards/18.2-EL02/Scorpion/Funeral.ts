import { cancel, gainHonor, sequential } from '../../../GameActions/GameActions.js';
import { FavorType, Phases, Stage } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import type { AbilityContext } from '../../../AbilityContext.js';

export default class Funeral extends DrawCard {
    static id = 'funeral';

    public setupCardAbilities() {
        this.wouldInterrupt('Cancel honor loss')
            .when({
                onModifyHonor: (event, context) =>
                    event.player === context.player &&
                    -event.amount >= context.player.honor &&
                    event.context?.stage === Stage.Effect,
                onTransferHonor: (event, context) =>
                    event.player === context.player &&
                    event.amount >= context.player.honor &&
                    event.context?.stage === Stage.Effect
            })
            .gameAction(sequential([
                cancel(),
                gainHonor((context) => ({ target: context.player }))
            ]))
            .effect('cancel their honor loss, then gain 1 honor')
            .cannotBeMirrored();
    }

    public canPlay(context: AbilityContext, playType: string) {
        return (
            context.game.currentPhase !== Phases.Draw &&
            context.game.getFavorSide() === FavorType.Political &&
            super.canPlay(context, playType)
        );
    }
}
