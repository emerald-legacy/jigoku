import DrawCard from '../../DrawCard.js';
import { Location, CardType } from '../../Constants.js';
import AbilityDsl from '../../abilitydsl.js';

class SoshiDiviner extends DrawCard {
    static id = 'soshi-diviner';

    setupCardAbilities() {
        this.action('Move a card in a province')
            .condition((context) => context.game.isDuringConflict())
            .target('cardInProvince', {
                location: [Location.Provinces, Location.PlayArea],
                cardCondition: card => (card.isInProvince() && card.type !== CardType.Province && card.type !== CardType.Stronghold)
            })
            .target('province', {
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
                        )
            }, AbilityDsl.actions.moveCard(context => ({
                target: context.targets.cardInProvince,
                destination: context.targets.province.location
            })))
            .effect('move {1} to {2}', context => [
                context.targets.cardInProvince.isFacedown() ? 'a facedown card' : context.targets.cardInProvince,
                context.targets.province.isFacedown() ? context.targets.province.location : context.targets.province
            ]);
    }
}


export default SoshiDiviner;
