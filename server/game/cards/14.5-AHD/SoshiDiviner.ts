import DrawCard from '../../DrawCard.js';
import type { ProvinceCard } from '../../ProvinceCard.js';
import { Locations, CardTypes } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class SoshiDiviner extends DrawCard {
    static id = 'soshi-diviner';

    setupCardAbilities() {
        this.action({
            title: 'Move a card in a province',
            condition: (context) => context.game.isDuringConflict(),
            targets: {
                cardInProvince: {
                    location: [Locations.Provinces, Locations.PlayArea],
                    cardCondition: card => (card.isInProvince() && card.type !== CardTypes.Province && card.type !== CardTypes.Stronghold)
                },
                province: {
                    targets: false,
                    dependsOn: 'cardInProvince',
                    location: [Locations.Provinces],
                    cardType: CardTypes.Province,
                    cardCondition: (card, context) =>
                        card.location !== Locations.StrongholdProvince &&
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
