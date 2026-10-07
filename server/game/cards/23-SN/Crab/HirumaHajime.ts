import { optional, turnFacedown } from '../../../GameActions/GameActions.js';
import { CardType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { moveCardInProvinceAction } from '../../moveCardInProvince.js';

export default class HirumaHajime extends DrawCard {
    static id = 'hiruma-hajime';

    setupCardAbilities() {
        moveCardInProvinceAction(this)
            .afterwardsIf((context) => context.targets.province.isConflictProvince() &&
                context.targets.cardInProvince.type !== CardType.Attachment &&
                context.targets.cardInProvince.isFaceup())
            .gameAction(optional((context) => ({
                promptTitleForConfirming: 'Do you want to turn ' + context.targets.cardInProvince.name + ' facedown?',
                gameAction: turnFacedown({ target: context.targets.cardInProvince }),
                showMessageOnNo: true,
                effect: 'turn {1} facedown',
                effectArgs: () => [context.player, context.targets.cardInProvince]
            })));
    }
}
