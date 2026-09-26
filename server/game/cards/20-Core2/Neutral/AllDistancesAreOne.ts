import type { AbilityContext } from '../../../AbilityContext.js';
import { CardType, Location } from '../../../Constants.js';
import type { Cost } from '../../../costs/Cost.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import DrawCard from '../../../DrawCard.js';

function captureOriginalProvince(): Cost<{ originalProvince: ProvinceCard }> {
    return {
        canPay() {
            return true;
        },
        resolve(context: AbilityContext) {
            context.costs.originalProvince = context.game.requireConflict().conflictProvince;
        },
        pay() { }
    };
}

export default class AllDistancesAreOne extends DrawCard {
    static id = 'all-distances-are-one';

    setupCardAbilities() {
        this.action('Move conflict to a different province')
            .cost(captureOriginalProvince())
            .condition((context) =>
                !!(context.game.currentConflict
                    ?.getConflictProvinces()
                    .every((province) => province.location !== Location.StrongholdProvince) &&
                context.player.cardsInPlay.some(
                    (card: DrawCard) => card.isParticipating() && card.hasTrait('shugenja')
                )))
            .gameAction(AbilityDsl.actions.selectCard((context) => ({
                cardType: CardType.Province,
                location: Location.Provinces,
                gameAction: AbilityDsl.actions.moveConflict(),
                message: '{0} moves the conflict to {1}',
                messageArgs: (card) => [context.player, card]
            })))
            .effect('move the conflict to another eligible province')
            .then((context) => ({
                thenCondition: () => !context.costs.originalProvince?.isBroken,
                gameAction: AbilityDsl.actions.onAffinity({
                    trait: 'water',
                    promptTitleForConfirmingAffinity: 'Flip the original province facedown?',
                    effect: 'flip {0} facedown',
                    effectArgs: () => [context.costs.originalProvince],
                    gameAction: AbilityDsl.actions.turnFacedown({
                        target: context.costs.originalProvince
                    })
                })
            }));
    }
}
