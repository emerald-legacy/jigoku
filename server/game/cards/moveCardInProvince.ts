import AbilityDsl from '../abilitydsl.js';
import { CardType, Location } from '../Constants.js';
import type DrawCard from '../DrawCard.js';

/** The 'Move a card in a province' action: moves a card in (or attached to) a province to another of its controller's unbroken non-stronghold provinces. */
export function moveCardInProvinceAction(source: DrawCard) {
    return source.action('Move a card in a province')
        .target({
            name: 'cardInProvince',
            location: [Location.Provinces, Location.PlayArea],
            cardType: [CardType.Attachment, CardType.Character, CardType.Event, CardType.Holding],
            cardCondition: card =>
                Boolean((card.isInProvince() && card.type !== CardType.Province && card.type !== CardType.Stronghold) ||
                    (card.type === CardType.Attachment && card.parent && card.parent.type === CardType.Province))
        })
        .target({
            name: 'province',
            dependsOn: 'cardInProvince',
            location: [Location.Provinces],
            cardType: CardType.Province,
            cardCondition: (card, context) =>
                card.location !== Location.StrongholdProvince &&
                    !card.isBroken &&
                    (
                        (context.targets.cardInProvince.type === CardType.Attachment && card.controller === context.targets.cardInProvince.parentProvince?.controller) ||
                        (context.targets.cardInProvince.type !== CardType.Attachment && card.controller === context.targets.cardInProvince.controller)
                    ) &&
                    (
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
        ]);
}
