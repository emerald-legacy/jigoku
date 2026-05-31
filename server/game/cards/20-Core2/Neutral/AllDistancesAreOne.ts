import type { AbilityContext } from '../../../AbilityContext.js';
import { CardTypes, Locations } from '../../../Constants.js';
import type { Cost } from '../../../Costs.js';
import { ProvinceCard } from '../../../ProvinceCard.js';
import AbilityDsl from '../../../abilitydsl.js';
import type { Conflict } from '../../../Conflict.js';
import DrawCard from '../../../DrawCard.js';

const CAPTURED_ORIGINAL_PROVINCE = Symbol('Capture Province');

type WithCapturedOriginalProvince<T> = T & { [CAPTURED_ORIGINAL_PROVINCE]: ProvinceCard };

function captureOriginalProvince(): Cost {
    return {
        canPay() {
            return true;
        },
        resolve(context: AbilityContext) {
            (context as any)[CAPTURED_ORIGINAL_PROVINCE] = (context.game.currentConflict as Conflict).conflictProvince;
        },
        pay() { }
    };
}

export default class AllDistancesAreOne extends DrawCard {
    static id = 'all-distances-are-one';

    setupCardAbilities() {
        this.action({
            title: 'Move conflict to a different province',
            condition: (context) =>
                !!((context.game.currentConflict as Conflict | undefined)
                    ?.getConflictProvinces()
                    .every((province: any) => province.location !== Locations.StrongholdProvince) &&
                context.player.cardsInPlay.some(
                    (card: DrawCard) => card.isParticipating() && card.hasTrait('shugenja')
                )),
            cost: captureOriginalProvince(),
            gameAction: AbilityDsl.actions.selectCard((context) => ({
                cardType: CardTypes.Province,
                location: Locations.Provinces,
                gameAction: AbilityDsl.actions.moveConflict(),
                message: '{0} moves the conflict to {1}',
                messageArgs: (card) => [context.player, card]
            })),
            effect: 'move the conflict to another eligible province',
            then: (context: WithCapturedOriginalProvince<AbilityContext>) => ({
                thenCondition: () => !(context[CAPTURED_ORIGINAL_PROVINCE] as ProvinceCard).isBroken,
                gameAction: AbilityDsl.actions.onAffinity({
                    trait: 'water',
                    promptTitleForConfirmingAffinity: 'Flip the original province facedown?',
                    effect: 'flip {0} facedown',
                    effectArgs: () => [context[CAPTURED_ORIGINAL_PROVINCE]],
                    gameAction: AbilityDsl.actions.turnFacedown({
                        target: context[CAPTURED_ORIGINAL_PROVINCE] as ProvinceCard
                    })
                })
            })
        });
    }
}
