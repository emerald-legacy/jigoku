import DrawCard from '../../drawcard.js';
import { Players } from '../../Constants.js';

class MirumotoDaisho extends DrawCard {
    static id = 'mirumoto-daisho';

    setupCardAbilities(ability: any) {
        this.whileAttached({
            effect: ability.effects.cannotHaveOtherRestrictedAttachments(this)
        });

        this.persistentEffect({
            condition: context => !!this.game.currentDuel && !!context.source.parent && this.game.currentDuel.isInvolved(context.source.parent),
            targetController: Players.Opponent,
            effect: [
                ability.effects.cannotBidInDuels('1'),
                ability.effects.cannotBidInDuels('5')
            ]
        });
    }
}


export default MirumotoDaisho;
