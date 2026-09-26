import DrawCard from '../../../DrawCard.js';
import type BaseCard from '../../../BaseCard.js';
import { CardType, Location } from '../../../Constants.js';
import AbilityDsl from '../../../abilitydsl.js';

class StoneBreaker extends DrawCard {
    static id = 'stone-breaker';

    setupCardAbilities() {
        this.action('Move a card in a province')
            .cost(AbilityDsl.costs.sacrificeSelf())
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
            .gameAction(AbilityDsl.actions.refillFaceup(context => ({ location: context.cardStateWhenInitiated?.location ?? [] })))
            .effect('move {1} to {2}', context => [
                context.targets.cardInProvince.isFacedown() ? 'a facedown card' : context.targets.cardInProvince,
                context.targets.province.isFacedown() ? context.targets.province.location : context.targets.province
            ]);

        this.action('Reduce province strength')
            .condition(context => context.game.isDuringConflict())
            .gameAction(AbilityDsl.actions.selectCard(context => ({
                activePromptTitle: 'Choose an attacked province',
                hidePromptIfSingleCard: true,
                cardType: CardType.Province,
                location: Location.Provinces,
                cardCondition: (card: BaseCard) => card.isConflictProvince() && card.isProvinceCard() && card.getStrength() > 0,
                message: '{0} reduces the strength of {1} by 2',
                messageArgs: cards => [context.player, cards],
                gameAction: AbilityDsl.actions.cardLastingEffect(() => ({
                    targetLocation: Location.Provinces,
                    effect: AbilityDsl.effects.modifyProvinceStrength(-2)
                }))
            })))
            .effect('reduce an attacked province strength by 2');
    }
}


export default StoneBreaker;
