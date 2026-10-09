import { modifyBid } from '../../GameActions/GameActions.js';
import DrawCard from '../../DrawCard.js';
import { Direction } from '../../GameActions/ModifyBidAction.js';

class IaijutsuMaster extends DrawCard {
    static id = 'iaijutsu-master';

    setupCardAbilities() {
        this.attachmentConditions({
            trait: 'duelist'
        });

        this.reaction('Change your bid by 1 during a duel')
            .when({
                onHonorDialsRevealed: (_event, context) =>
                    !!context.source.parentCharacter && !!this.game.currentDuel?.isInvolved(context.source.parentCharacter)
            })
            .gameAction(modifyBid({ direction: Direction.Prompt }));
    }
}


export default IaijutsuMaster;
