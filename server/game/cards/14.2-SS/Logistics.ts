import DrawCard from '../../DrawCard.js';
import { Location, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class Logistics extends DrawCard {
    static id = 'logistics';

    setupCardAbilities() {
        this.action('Move a card in a province')
            .target('cardInProvince', {
                cardType: [CardType.Attachment, CardType.Character, CardType.Event, CardType.Holding],
                location: [Location.Provinces, Location.PlayArea],
                cardCondition: (card) =>
                    Boolean((card.isInProvince() && card.type !== CardType.Province && card.type !== CardType.Stronghold) ||
                    (card.type === CardType.Attachment && card.parent && card.parent.type === CardType.Province))
            })
            .target('province', {
                dependsOn: 'cardInProvince',
                location: [Location.Provinces],
                cardType: CardType.Province,
                cardCondition: (card, context) => {
                    const moving = context.targets.cardInProvince;
                    return card.location !== Location.StrongholdProvince &&
                        !card.isBroken &&
                        ( //same controller check
                            (moving.type === CardType.Attachment && card.controller === moving.parentProvince?.controller) ||
                            (moving.type !== CardType.Attachment && card.controller === moving.controller)
                        ) &&
                        ( //different location check
                            (moving.type === CardType.Attachment && card.location !== moving.parentProvince?.location) ||
                            (moving.type !== CardType.Attachment && card.location !== moving.location)
                        );
                }
            }, AbilityDsl.actions.multiple([
                AbilityDsl.actions.conditional((context) => ({
                    condition: context.targets.cardInProvince.type === CardType.Attachment,
                    trueGameAction: AbilityDsl.actions.attach({
                        target: context.targets.province,
                        attachment: context.targets.cardInProvince
                    }),
                    falseGameAction: AbilityDsl.actions.moveCard({
                        target: context.targets.cardInProvince,
                        destination: context.targets.province.location
                    })
                })),
                AbilityDsl.actions.draw((context) => ({ target: context.game.isTraitInPlay('battlefield') ? context.player : [] }))
            ]))
            .effect('move {1} to {2}{3}', (context) => [
                context.targets.cardInProvince.isFacedown() ? 'a facedown card' : context.targets.cardInProvince,
                context.targets.province.isFacedown() ? context.targets.province.location : context.targets.province,
                context.game.isTraitInPlay('battlefield') ? ' and draw a card' : ''
            ]);
    }
}


export default Logistics;
