import AbilityDsl from '../../../abilitydsl.js';
import { CardType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';
import { moveCardInProvinceAction } from '../../moveCardInProvince.js';

export default class HirumaHajime extends DrawCard {
    static id = 'hiruma-hajime';

    setupCardAbilities() {
        moveCardInProvinceAction(this)
            .then((context) => ({
                thenCondition: () => context.targets.province.isConflictProvince() && context.targets.cardInProvince.type !== CardType.Attachment && context.targets.cardInProvince.isFaceup(),
                gameAction: AbilityDsl.actions.optional(() => ({
                    promptTitleForConfirming: 'Do you want to turn ' + context.targets.cardInProvince.name + ' facedown?',
                    gameAction: AbilityDsl.actions.turnFacedown({
                        target: context.targets.cardInProvince
                    }),
                    showMessageOnNo: true,
                    effect: 'turn {1} facedown',
                    effectArgs: () => [context.player, context.targets.cardInProvince]
                }))
            }));
    }
}
