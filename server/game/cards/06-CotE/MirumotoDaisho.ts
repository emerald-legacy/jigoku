import { cannotBidInDuels, cannotHaveOtherRestrictedAttachments } from '../../effects.js';
import DrawCard from '../../DrawCard.js';
import { Players } from '../../Constants.js';

class MirumotoDaisho extends DrawCard {
    static id = 'mirumoto-daisho';

    setupCardAbilities() {
        this.whileAttached({
            effect: cannotHaveOtherRestrictedAttachments(this)
        });

        this.persistentEffect({
            condition: (context) => !!this.game.currentDuel && !!context.source.parentCharacter && this.game.currentDuel.isInvolved(context.source.parentCharacter),
            targetController: Players.Opponent,
            effect: [
                cannotBidInDuels('1'),
                cannotBidInDuels('5')
            ]
        });
    }
}


export default MirumotoDaisho;
