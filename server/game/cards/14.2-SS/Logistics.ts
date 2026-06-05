import BaseCard from '../../BaseCard.js';
import DrawCard from '../../DrawCard.js';
import type { ProvinceCard } from '../../ProvinceCard.js';
import { Location, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class Logistics extends DrawCard {
    static id = 'logistics';

    setupCardAbilities() {
        this.action({
            title: 'Move a card in a province',
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
                            (context.targets.cardInProvince.type === CardType.Attachment && card.controller === context.targets.cardInProvince.parent.controller) ||
                            (context.targets.cardInProvince.type !== CardType.Attachment && card.controller === context.targets.cardInProvince.controller)
                        ) &&
                        ( //different location check
                            (context.targets.cardInProvince.type === CardType.Attachment && card.location !== context.targets.cardInProvince.parent.location) ||
                            (context.targets.cardInProvince.type !== CardType.Attachment && card.location !== context.targets.cardInProvince.location)
                        ),
                    gameAction: AbilityDsl.actions.multiple([
                        AbilityDsl.actions.conditional(context => ({
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
                        AbilityDsl.actions.draw(context => ({ target: context.game.isTraitInPlay('battlefield') ? context.player : [] }))
                    ])
                }
            },
            effect: 'move {1} to {2}{3}',
            effectArgs: context => [
                (context.targets.cardInProvince as DrawCard).isFacedown() ? 'a facedown card' : context.targets.cardInProvince as DrawCard,
                (context.targets.province as ProvinceCard).isFacedown() ? (context.targets.province as ProvinceCard).location : context.targets.province as ProvinceCard,
                context.game.isTraitInPlay('battlefield') ? ' and draw a card' : ''
            ]
        });
    }
}


export default Logistics;
