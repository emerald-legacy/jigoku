import DrawCard from '../../../drawcard.js';
import type { ProvinceCard } from '../../../ProvinceCard.js';
import { CardTypes, Locations } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';

class StoneBreaker extends DrawCard {
    static id = 'stone-breaker';

    setupCardAbilities() {
        this.action({
            title: 'Move a card in a province',
            cost: AbilityDsl.costs.sacrificeSelf(),
            targets: {
                cardInProvince: {
                    location: [Locations.Provinces, Locations.PlayArea],
                    cardCondition: card =>
                        (card.isInProvince() && card.type !== CardTypes.Province && card.type !== CardTypes.Stronghold) ||
                        (card.type === CardTypes.Attachment && card.parent && card.parent.type === CardTypes.Province)
                },
                province: {
                    targets: false,
                    dependsOn: 'cardInProvince',
                    location: [Locations.Provinces],
                    cardType: CardTypes.Province,
                    cardCondition: (card, context) =>
                        card.location !== Locations.StrongholdProvince &&
                        !card.isBroken &&
                        ( //same controller check
                            (context.targets.cardInProvince.type === CardTypes.Attachment && card.controller === context.targets.cardInProvince.parent.controller) ||
                            (context.targets.cardInProvince.type !== CardTypes.Attachment && card.controller === context.targets.cardInProvince.controller)
                        ) &&
                        ( //different location check
                            (context.targets.cardInProvince.type === CardTypes.Attachment && card.location !== context.targets.cardInProvince.parent.location) ||
                            (context.targets.cardInProvince.type !== CardTypes.Attachment && card.location !== context.targets.cardInProvince.location)
                        ),
                    gameAction: AbilityDsl.actions.conditional(context => ({
                        condition: context.targets.cardInProvince.type === CardTypes.Attachment,
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
                cardType: CardTypes.Province,
                location: Locations.Provinces,
                cardCondition: card => card.isConflictProvince() && card.getStrength() > 0,
                message: '{0} reduces the strength of {1} by 2',
                messageArgs: cards => [context.player, cards],
                gameAction: AbilityDsl.actions.cardLastingEffect(() => ({
                    targetLocation: Locations.Provinces,
                    effect: AbilityDsl.effects.modifyProvinceStrength(-2)
                }))
            })),
            effect: 'reduce an attacked province strength by 2'
        });
    }
}


export default StoneBreaker;
