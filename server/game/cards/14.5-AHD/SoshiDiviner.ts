import DrawCard from '../../DrawCard.js';
import type { ProvinceCard } from '../../ProvinceCard.js';
import { Location, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class SoshiDiviner extends DrawCard {
    static id = 'soshi-diviner';

    setupCardAbilities() {
        this.action({
            title: 'Move a card in a province',
            condition: (context) => context.game.isDuringConflict(),
            targets: {
                cardInProvince: {
                    location: [Location.Provinces, Location.PlayArea],
                    cardCondition: card => (card.isInProvince() && card.type !== CardType.Province && card.type !== CardType.Stronghold)
                },
                province: {
                    targets: false,
                    dependsOn: 'cardInProvince',
                    location: [Location.Provinces],
                    cardType: CardType.Province,
                    cardCondition: (card, context) =>
                        card.location !== Location.StrongholdProvince &&
                        ( //same controller check
                            (card.controller === context.targets.cardInProvince.controller)
                        ) &&
                        ( //different location check
                            (card.location !== context.targets.cardInProvince.location)
                        ),
                    gameAction: AbilityDsl.actions.moveCard(context => ({
                        target: context.targets.cardInProvince,
                        destination: context.targets.province.location
                    }))
                }
            },
            effect: 'move {1} to {2}',
            effectArgs: context => [
                (context.targets.cardInProvince as DrawCard).isFacedown() ? 'a facedown card' : context.targets.cardInProvince as DrawCard,
                (context.targets.province as ProvinceCard).isFacedown() ? (context.targets.province as ProvinceCard).location : context.targets.province as ProvinceCard
            ]
        });
    }
}


export default SoshiDiviner;
