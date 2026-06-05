import DrawCard from '../../../DrawCard.js';
import type BaseCard from '../../../BaseCard.js';
import type { ProvinceCard } from '../../../ProvinceCard.js';
import { CardType, Location } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';

class StoneBreaker extends DrawCard {
    static id = 'stone-breaker';

    setupCardAbilities() {
        this.action({
            title: 'Move a card in a province',
            cost: AbilityDsl.costs.sacrificeSelf(),
            targets: {
                cardInProvince: {
                    location: [Location.Provinces, Location.PlayArea],
                    cardCondition: card =>
                        Boolean((card.isInProvince() && card.type !== CardType.Province && card.type !== CardType.Stronghold) ||
                        (card.type === CardType.Attachment && card.parent && card.parent.type === CardType.Province))
                },
                province: {
                    targets: false,
                    dependsOn: 'cardInProvince',
                    location: [Location.Provinces],
                    cardType: CardType.Province,
                    cardCondition: (card: BaseCard, context) =>
                        card.location !== Location.StrongholdProvince &&
                        !(card as ProvinceCard).isBroken &&
                        ( //same controller check
                            ((context.targets.cardInProvince as DrawCard).type === CardType.Attachment && card.controller === (context.targets.cardInProvince as DrawCard).parent?.controller) ||
                            ((context.targets.cardInProvince as DrawCard).type !== CardType.Attachment && card.controller === (context.targets.cardInProvince as DrawCard).controller)
                        ) &&
                        ( //different location check
                            ((context.targets.cardInProvince as DrawCard).type === CardType.Attachment && card.location !== (context.targets.cardInProvince as DrawCard).parent?.location) ||
                            ((context.targets.cardInProvince as DrawCard).type !== CardType.Attachment && card.location !== (context.targets.cardInProvince as DrawCard).location)
                        ),
                    gameAction: AbilityDsl.actions.conditional(context => ({
                        condition: context.targets.cardInProvince.type === CardType.Attachment,
                        trueGameAction: AbilityDsl.actions.attach({
                            target: context.targets.province,
                            attachment: context.targets.cardInProvince
                        }),
                        falseGameAction: AbilityDsl.actions.moveCard({
                            target: context.targets.cardInProvince,
                            destination: context.targets.province.location
                        })
                    }))
                }
            },
            effect: 'move {1} to {2}',
            effectArgs: context => [
                (context.targets.cardInProvince as DrawCard).isFacedown() ? 'a facedown card' : context.targets.cardInProvince,
                (context.targets.province as ProvinceCard).isFacedown() ? (context.targets.province as ProvinceCard).location : context.targets.province
            ],
            gameAction: AbilityDsl.actions.refillFaceup(context => ({ location: context.cardStateWhenInitiated.location }))

        });

        this.action({
            title: 'Reduce province strength',
            condition: context => context.game.isDuringConflict(),
            gameAction: AbilityDsl.actions.selectCard(context => ({
                activePromptTitle: 'Choose an attacked province',
                hidePromptIfSingleCard: true,
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: card => card.isConflictProvince() && card.getStrength() > 0,
                message: '{0} reduces the strength of {1} by 2',
                messageArgs: cards => [context.player, cards],
                gameAction: AbilityDsl.actions.cardLastingEffect(() => ({
                    targetLocation: Location.Provinces,
                    effect: AbilityDsl.effects.modifyProvinceStrength(-2)
                }))
            })),
            effect: 'reduce an attacked province strength by 2'
        });
    }
}


export default StoneBreaker;
