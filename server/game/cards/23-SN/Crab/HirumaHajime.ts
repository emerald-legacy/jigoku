import AbilityDsl from '../../../abilitydsl.js';
import { Location, CardType } from '../../../Constants.js';
import DrawCard from '../../../DrawCard.js';

export default class HirumaHajime extends DrawCard {
    static id = 'hiruma-hajime';

    setupCardAbilities() {
        this.action('Move a card in a province')
            .target('cardInProvince', {
                location: [Location.Provinces, Location.PlayArea],
                cardType: [CardType.Attachment, CardType.Character, CardType.Event, CardType.Holding],
                cardCondition: card =>
                    Boolean((card.isInProvince() && card.type !== CardType.Province && card.type !== CardType.Stronghold) ||
                            (card.type === CardType.Attachment && card.parent && card.parent.type === CardType.Province))
            })
            .target('province', {
                dependsOn: 'cardInProvince',
                location: [Location.Provinces],
                cardType: CardType.Province,
                cardCondition: (card, context) =>
                    card.location !== Location.StrongholdProvince &&
                        !card.isBroken &&
                        ( //same controller check
                            (context.targets.cardInProvince.type === CardType.Attachment && card.controller === context.targets.cardInProvince.parentProvince?.controller) ||
                            (context.targets.cardInProvince.type !== CardType.Attachment && card.controller === context.targets.cardInProvince.controller)
                        ) &&
                        ( //different location check
                            (context.targets.cardInProvince.type === CardType.Attachment && card.location !== context.targets.cardInProvince.parentProvince?.location) ||
                            (context.targets.cardInProvince.type !== CardType.Attachment && card.location !== context.targets.cardInProvince.location)
                        )
            }, AbilityDsl.actions.conditional(context => ({
                condition: context.targets.cardInProvince.type === CardType.Attachment,
                trueGameAction: AbilityDsl.actions.attach({
                    target: context.targets.province,
                    attachment: context.targets.cardInProvince
                }),
                falseGameAction: AbilityDsl.actions.moveCard({
                    target: context.targets.cardInProvince,
                    destination: context.targets.province.location
                })
            })))
            .effect('move {1} to {2}', context => [
                context.targets.cardInProvince.isFacedown() ? 'a facedown card' : context.targets.cardInProvince,
                context.targets.province.isFacedown() ? context.targets.province.location : context.targets.province
            ])
            .then((context) => ({
                thenCondition: () => !!context.targets.province.isConflictProvince() && context.targets.cardInProvince.type !== CardType.Attachment && context.targets.cardInProvince.isFaceup(),
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
