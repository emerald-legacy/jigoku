import { optional, turnFacedown } from '../../../GameActions/GameActions.js';
import { CardType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { moveCardInProvinceAction } from '../../moveCardInProvince.js';
import { msg } from '../../../GameChat.js';

export default class HirumaHajime extends DrawCard {
    static id = 'hiruma-hajime';

    setupCardAbilities() {
        moveCardInProvinceAction(this)
            .afterwardsIf((context) => context.targets.province.isConflictProvince() &&
                context.targets.cardInProvince.type !== CardType.Attachment &&
                context.targets.cardInProvince.isFaceup())
            .gameAction(optional((context) => ({
                prompt: 'Do you want to turn ' + context.targets.cardInProvince.name + ' facedown?',
                gameAction: turnFacedown({ target: context.targets.cardInProvince }),
                acceptMessage: (_context, chooser) => msg`${chooser} chooses to turn ${context.targets.cardInProvince} facedown`,
                declineMessage: (_context, chooser) => msg`${chooser} chooses not to turn ${context.targets.cardInProvince} facedown`
            })));
    }
}
