import AbilityDsl from '../../abilitydsl.js';
import DrawCard from '../../DrawCard.js';
import { Players } from '../../Constants.js';

class MirumotoDaisho extends DrawCard {
    static id = 'mirumoto-daisho';

    setupCardAbilities() {
        this.whileAttached({
            effect: AbilityDsl.effects.cannotHaveOtherRestrictedAttachments(this)
        });

        this.persistentEffect({
            condition: context => !!this.game.currentDuel && !!context.source.parentCharacter && this.game.currentDuel.isInvolved(context.source.parentCharacter),
            targetController: Players.Opponent,
            effect: [
                AbilityDsl.effects.cannotBidInDuels('1'),
                AbilityDsl.effects.cannotBidInDuels('5')
            ]
        });
    }
}


export default MirumotoDaisho;
