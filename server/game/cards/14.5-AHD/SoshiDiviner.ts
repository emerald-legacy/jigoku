import { msg } from '../../GameChat.js';
import DrawCard from '../../DrawCard.js';
import { Location, CardType } from '../../Constants.js';
import { moveCard } from '../../GameActions/GameActions.js';

class SoshiDiviner extends DrawCard {
    static id = 'soshi-diviner';

    setupCardAbilities() {
        this.action('Move a card in a province')
            .condition((context) => context.game.isDuringConflict())
            .target({
                name: 'cardInProvince',
                location: [Location.Provinces, Location.PlayArea],
                cardCondition: (card) => card.isInProvince() && card.type !== CardType.Province && card.type !== CardType.Stronghold
            })
            .target({
                name: 'province',
                dependsOn: 'cardInProvince',
                location: [Location.Provinces],
                cardType: CardType.Province,
                cardCondition: (card, context) =>
                    card.location !== Location.StrongholdProvince &&
                    card.controller === context.targets.cardInProvince.controller &&
                    card.location !== context.targets.cardInProvince.location
            }, moveCard((context) => ({
                target: context.targets.cardInProvince,
                destination: context.targets.province.location
            })))
            .chatText((context) => msg`move ${context.targets.cardInProvince.isFacedown() ? 'a facedown card' : context.targets.cardInProvince} to ${context.targets.province.isFacedown() ? context.targets.province.location : context.targets.province}`);
    }
}


export default SoshiDiviner;
