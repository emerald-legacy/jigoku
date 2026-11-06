import { Trait } from '../../Constants.js';
import DrawCard from '../../DrawCard.js';
import { Direction } from '../../GameActions/ModifyBidAction.js';

class IaijutsuMaster extends DrawCard {
    static id = 'iaijutsu-master';

    override setupCardAbilities() {
        this.attachmentConditions({
            trait: Trait.Duelist
        });

        this.reaction('Change your bid by 1 during a duel')
            .when({
                onHonorDialsRevealed: (_event, context) =>
                    !!context.source.parentCharacter && !!this.game.currentDuel?.isInvolved(context.source.parentCharacter)
            })
            .modifyBid({ direction: Direction.Prompt });
    }
}


export default IaijutsuMaster;
